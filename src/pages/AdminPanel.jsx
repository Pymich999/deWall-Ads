import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState("pendingWalls"); // Manage active tab
    const [walls, setWalls] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch pending walls
    const fetchPendingWalls = async () => {
        setLoading(true);
        setError(null);
        try {
            const wallQuery = query(
                collection(db, "dewall", "database", "wall_list"),
                where("hide", "==", true)
            );
            const querySnapshot = await getDocs(wallQuery);
            const wallsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setWalls(wallsData);
        } catch (err) {
            console.error("Error fetching pending walls:", err);
            setError("Failed to fetch walls. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch users and their posted wall counts
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const userQuery = collection(db, "dewall", "user_node", "profile");
            const userSnapshot = await getDocs(userQuery);

            // Retrieve walls to count how many each user has posted
            const wallSnapshot = await getDocs(collection(db, "dewall", "database", "wall_list"));

            const wallsData = wallSnapshot.docs.map((doc) => ({
                owner_uid: doc.data().owner_uid,
            }));

            const usersData = userSnapshot.docs.map((userDoc) => {
                const userData = userDoc.data();
                const wallCount = wallsData.filter(
                    (wall) => wall.owner_uid === userDoc.id
                ).length;

                return {
                    id: userDoc.id,
                    ...userData,
                    wallsPosted: wallCount,
                };
            });

            setUsers(usersData);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Approve or reject a wall
    const toggleWallApproval = async (wallId, approve) => {
        try {
            const wallRef = doc(db, "dewall", "database", "wall_list", wallId);
            await updateDoc(wallRef, {
                hide: !approve,
            });
            alert(`Wall has been ${approve ? "approved" : "rejected"}.`);
            fetchPendingWalls();
        } catch (err) {
            console.error("Error updating wall approval:", err);
            alert("Failed to update wall status. Please try again.");
        }
    };

    // Delete a user and their walls
    const deleteUser = async (userId) => {
        try {
            // Delete user's profile
            const userRef = doc(db, "dewall", "user_node", "profile", userId);
            await deleteDoc(userRef);

            // Delete all walls posted by this user
            const wallSnapshot = await getDocs(
                query(collection(db, "dewall", "database", "wall_list"), where("owner_uid", "==", userId))
            );

            const deleteWallPromises = wallSnapshot.docs.map((wallDoc) =>
                deleteDoc(wallDoc.ref)
            );
            await Promise.all(deleteWallPromises);

            alert("User and their walls have been deleted.");
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user. Please try again.");
        }
    };

    // Fetch data on tab change
    useEffect(() => {
        if (activeTab === "pendingWalls") {
            fetchPendingWalls();
        } else if (activeTab === "manageUsers") {
            fetchUsers();
        }
    }, [activeTab]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                {/* Navbar */}
                <div className="flex justify-between mb-6">
                    <button
                        onClick={() => setActiveTab("pendingWalls")}
                        className={`px-4 py-2 rounded-md ${activeTab === "pendingWalls" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                        Manage Walls
                    </button>
                    <button
                        onClick={() => setActiveTab("manageUsers")}
                        className={`px-4 py-2 rounded-md ${activeTab === "manageUsers" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                        Manage Users
                    </button>
                    <button
                        onClick={() => navigate("/auth")}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                        Logout
                    </button>
                </div>

                {loading && <p className="text-center text-blue-700">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {/* Manage Walls */}
                {activeTab === "pendingWalls" && (
                    walls.length > 0 ? (
                        walls.map((wall) => (
                            <div key={wall.id} className="border p-4 mb-4">
                                <div className="mb-4 flex gap-4 overflow-x-auto">
                                    {wall.photo_urls && wall.photo_urls.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Wall ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-md mb-4"
                                        />
                                    ))}
                                </div>
                                <p><strong>City:</strong> {wall.city || "N/A"}</p>
                                <p><strong>Pincode:</strong> {wall.pincode || "N/A"}</p>
                                <p><strong>Owner:</strong> {wall.owner_username || "N/A"}</p>
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                        onClick={() => toggleWallApproval(wall.id, true)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                        onClick={() => toggleWallApproval(wall.id, false)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && <p className="text-center text-blue-900">No pending walls for approval.</p>
                    )
                )}

                {/* Manage Users */}
                {activeTab === "manageUsers" && (
                    users.length > 0 ? (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2">Name</th>
                                    <th className="border border-gray-300 p-2">Email</th>
                                    <th className="border border-gray-300 p-2">Phone</th>
                                    <th className="border border-gray-300 p-2">Walls Posted</th>
                                    <th className="border border-gray-300 p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="border border-gray-300 p-2">{user.full_name || "N/A"}</td>
                                        <td className="border border-gray-300 p-2">{user.email || "N/A"}</td>
                                        <td className="border border-gray-300 p-2">{user.mobile || "N/A"}</td>
                                        <td className="border border-gray-300 p-2">{user.wallsPosted}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        !loading && <p className="text-center text-blue-900">No users found.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminPanel;

