import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddWallForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [wallData, setWallData] = useState({
    available: true,
    city: "",
    district: "",
    state: "",
    locality: "",
    pincode: "",
    owner_phone: "",
    owner_uid: "",
    owner_username: "",
    photo_urls: ["", "", ""], // Three image placeholders
    price: 500,
    rent_per_month: 500,
    size: { length: "", width: "" },
    site_id: "",
    tags: [],
    timestamp: new Date(),
  });

  useEffect(() => {
    // Load user profile data
    const user = auth.currentUser;
    if (user) {
      setWallData((prevData) => ({
        ...prevData,
        owner_uid: user.uid,
        owner_username: user.displayName || "",
        owner_phone: user.phoneNumber || "",
      }));
    }
  }, []);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedPhotoUrls = [...wallData.photo_urls];
      updatedPhotoUrls[index] = reader.result; // Store Base64 string as URL
      setWallData((prevData) => ({ ...prevData, photo_urls: updatedPhotoUrls }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "length" || name === "width") {
      setWallData((prevData) => ({
        ...prevData,
        size: { ...prevData.size, [name]: value },
      }));
    } else {
      setWallData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSliderChange = (e) => {
    const price = e.target.value;
    setWallData((prevData) => ({
      ...prevData,
      price: price,
      rent_per_month: price,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const siteId = `site_${Date.now()}`;
      const tags = [
        wallData.city,
        wallData.district,
        wallData.pincode,
        wallData.state,
        wallData.locality,
      ].map((tag) => tag.toLowerCase());

      const wallQuery = query(
        collection(db, "dewall", "database", "wall_list"),
        where("site_id", "==", siteId)
      );
      const existingWall = await getDocs(wallQuery);
      if (!existingWall.empty) {
        throw new Error("A wall with this site ID already exists.");
      }

      await addDoc(collection(db, "dewall", "database", "wall_list"), {
        ...wallData,
        site_id: siteId,
        tags,
      });

      alert("Wall added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md border border-blue-100">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
            Add Wall - Step 1
          </h2>

          {/* Wall Size */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-900 font-semibold mb-2">
                Length (feet)
              </label>
              <input
                type="number"
                name="length"
                placeholder="Length"
                value={wallData.size.length}
                onChange={handleChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-2">
                Width (feet)
              </label>
              <input
                type="number"
                name="width"
                placeholder="Width"
                value={wallData.size.width}
                onChange={handleChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Rent per Month */}
          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              Rent per Month (₹)
            </label>
            <input
              type="number"
              name="rent_per_month"
              value={wallData.rent_per_month}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              Please add exactly 3 images:
            </label>
            <div className="grid grid-cols-3 gap-4">
              {wallData.photo_urls.map((url, index) => (
                <label
                  key={index}
                  className="border border-blue-300 rounded-md p-2 flex flex-col items-center justify-center cursor-pointer"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-blue-500 font-semibold">
                      Photo {index + 1}
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index)}
                    className="hidden"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => setStep(2)}
            className="w-full bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
            Add Wall - Step 2
          </h2>

          {/* Step 2 Inputs */}
          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={wallData.city}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              placeholder="Enter pincode"
              value={wallData.pincode}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              District
            </label>
            <input
              type="text"
              name="district"
              placeholder="Enter district"
              value={wallData.district}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={wallData.state}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              Locality (Address)
            </label>
            <input
              type="text"
              name="locality"
              placeholder="Enter locality"
              value={wallData.locality}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default AddWallForm;
