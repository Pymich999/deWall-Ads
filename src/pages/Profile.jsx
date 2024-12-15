import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState(null); // null for the button menu
  const [userPosts, setUserPosts] = useState([]); // User's posts
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Notification toggle
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile data
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

  // Fetch user's posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const postsQuery = query(
            collection(db, "dewall", "database", "wall_list"),
            where("owner_uid", "==", user.uid) // Adjust `user.uid` if necessary
          );
          const querySnapshot = await getDocs(postsQuery);
          const postsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            approved: !doc.data().hide, // Map `hide` to `approved`
          }));
          setUserPosts(postsData);
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };
  
    fetchUserPosts();
  }, []);
  


  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed", error.message);
    }
  };

  // Render active section
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
            </div>
          </div>
        );
        case "posts":
          return (
            <div>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">My Posts</h2>
              <div className="space-y-4">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border rounded-lg p-4 shadow-md hover:shadow-lg bg-gray-50"
                    >
                      <h3 className="text-lg font-semibold text-blue-800">{post.city || "N/A"}</h3>
                      <p className="text-blue-600">{post.size ? `${post.size.length} x ${post.size.width}` : "N/A"} </p>
                      <div className="flex justify-between items-center mt-2">
                        <span
                          className={`px-2 py-1 rounded-full text-white ${
                            post.approved ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {post.approved ? "Approved" : "Rejected"}
                        </span>
                        <button
                          onClick={() => navigate(`/wall-details/${post.id}`)}
                          className="text-blue-600 underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-blue-800">No posts available.</p>
                )}
              </div>
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-lg border border-blue-100 w-2/3 min-h-1/2">
        {!activeSection ? (
          <div>
            <h1 className="text-2xl font-semibold text-center mb-4">Profile Menu</h1>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {["profile", "posts", "dashboard", "settings"].map((section) => (
                <button
                  key={section}
                  className="bg-blue-500 text-white py-4 rounded hover:bg-blue-600"
                  onClick={() => setActiveSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-4"
              onClick={() => setActiveSection(null)}
            >
              Back
            </button>
            {renderSection()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

