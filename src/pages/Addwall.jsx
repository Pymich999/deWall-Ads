import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddWallForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
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
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "dewall", "user_node", "profile", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const ownerUsername = userData.full_name || user.displayName || "Anonymous";
            const ownerPhone = userData.mobile || user.phoneNumber || "";

            setWallData((prevData) => ({
              ...prevData,
              owner_uid: user.uid,
              owner_username: ownerUsername,
              owner_phone: ownerPhone,
            }));
          } else {
            console.error("User profile document does not exist.");
          }
        } else {
          console.error("No user is logged in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);


  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "wall_upload");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dubb7rhoy/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        const updatedPhotoUrls = [...wallData.photo_urls];
        updatedPhotoUrls[index] = data.secure_url; // Store the secure URL returned by Cloudinary
        setWallData((prevData) => ({ ...prevData, photo_urls: updatedPhotoUrls }));
      } else {
        console.error("Image upload failed:", data);
        alert("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false); // Hide loading indicator
    }
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
        hide: true, // Default to hidden
      });

      alert("Wall added successfully and sent for admin approval!");
      navigate("/");
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Error adding wall. Please try again.");
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
                Length (feet) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="length"
                placeholder="Length"
                value={wallData.size.length}
                onChange={handleChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-2">
                Width (feet) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="width"
                placeholder="Width"
                value={wallData.size.width}
                onChange={handleChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* Rent per Month */}
          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              Rent per Month (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="rent_per_month"
              value={wallData.rent_per_month}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              Please add exactly 3 images: <span className="text-red-500">*</span>
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
                    required
                  />
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition duration-200"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Continue"}
          </button>
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-black hover:underline px-2 py-1"
            >
              &larr; Back
            </button>
            <h2 className="text-2xl font-bold text-blue-900">Add Wall - Step 2</h2>
          </div>


          {/* Step 2 Inputs */}
          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={wallData.city}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              placeholder="Enter pincode"
              value={wallData.pincode}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              District <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="district"
              placeholder="Enter district"
              value={wallData.district}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={wallData.state}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-blue-900 font-semibold mb-2">
              Locality (Address) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="locality"
              placeholder="Enter locality"
              value={wallData.locality}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

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
