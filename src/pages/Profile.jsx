import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // For navigation

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("profile"); // For managing active section
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Notification toggle
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // State for Help Modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const userDoc = await getDoc(doc(db, "dewall/user_node/profile", uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/auth"); // Redirect to auth page after logout
    } catch (error) {
      console.error("Logout failed", error.message);
    }
  };

  // Function to render active section
  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Profile</h2>
            <div className="text-blue-900">
              <p className="mb-2">
                <strong className="font-semibold">Full Name:</strong> {userData?.full_name}
              </p>
              <p className="mb-2">
                <strong className="font-semibold">Email:</strong> {userData?.email}
              </p>
              <p className="mb-2">
                <strong className="font-semibold">Mobile:</strong> {userData?.mobile}
              </p>
              <p className="mb-2">
                <strong className="font-semibold">Location:</strong>
                <span className="text-gray-600">{` Latitude: ${userData?.location.latitude}, Longitude: ${userData?.location.longitude}`}</span>
              </p>
            </div>
          </div>
        );
      case "posts":
        return (
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">My Posts</h2>
            <p className="text-blue-700">All posts uploaded by the user will appear here.</p>
          </div>
        );
      case "dashboard":
        return (
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Dashboard</h2>
            <p className="text-blue-700">Dashboard is currently empty.</p>
          </div>
        );
      case "settings":
        return (
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Settings</h2>
            <div className="mb-4">
              <label className="flex items-center space-x-3">
                <span className="text-blue-900 font-medium">🔔 Notifications</span>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  className="toggle-checkbox"
                />
              </label>
            </div>
            <div className="mb-4">
              <a
                href="https://www.dewallads.com/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                🔒 Privacy Policy
              </a>
            </div>
            <div className="mb-4">
              <a
                href="https://www.dewallads.com/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                📜 Terms and Conditions
              </a>
            </div>
            <div className="mb-4">
              <button
                onClick={() => setIsHelpModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                🤝 Help and Support
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              🚪 Logout
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg border border-blue-100">
      {/* Header */}
      <div className="bg-blue-800 text-white text-center py-4 rounded-lg mb-4">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p>{userData?.email}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-around text-blue-800 border-b-2 border-blue-100 mb-4">
        <button
          className={`px-4 py-2 ${activeSection === "profile" ? "font-bold" : ""}`}
          onClick={() => setActiveSection("profile")}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 ${activeSection === "posts" ? "font-bold" : ""}`}
          onClick={() => setActiveSection("posts")}
        >
          My Posts
        </button>
        <button
          className={`px-4 py-2 ${activeSection === "dashboard" ? "font-bold" : ""}`}
          onClick={() => setActiveSection("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 ${activeSection === "settings" ? "font-bold" : ""}`}
          onClick={() => setActiveSection("settings")}
        >
          Settings
        </button>
      </div>

      {/* Section Content */}
      <div>{renderSection()}</div>

      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Help and Support</h2>
            <p className="text-blue-900 mb-2">
              📧 Email: <a href="mailto:support@dewallads.com">support@dewallads.com</a>
            </p>
            <p className="text-blue-900 mb-4">📞 Phone: +123 456 7890</p>
            <button
              onClick={() => setIsHelpModalOpen(false)} // Close Help Modal
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

