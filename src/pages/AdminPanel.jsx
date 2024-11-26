import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const AdminPanel = () => {
    const [walls, setWalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch walls with `hide === true` (pending approval)
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

    // Approve or Reject a wall
    const toggleWallApproval = async (wallId, approve) => {
        try {
            const wallRef = doc(db, "dewall", "database", "wall_list", wallId);
            await updateDoc(wallRef, {
                hide: !approve, // Approve: set `hide` to false, Reject: keep `true`
            });
            alert(`Wall has been ${approve ? "approved" : "rejected"}.`);
            // Refresh the pending walls list
            fetchPendingWalls();
        } catch (err) {
            console.error("Error updating wall approval:", err);
            alert("Failed to update wall status. Please try again.");
        }
    };

    // Fetch pending walls on component mount
    useEffect(() => {
        fetchPendingWalls();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Admin Panel</h1>

                {loading && <p className="text-center text-blue-700">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {walls.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">City</th>
                                <th className="border border-gray-300 p-2 text-left">Pincode</th>
                                <th className="border border-gray-300 p-2 text-left">Owner</th>
                                <th className="border border-gray-300 p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {walls.map((wall) => (
                                <tr key={wall.id}>
                                    <td className="border border-gray-300 p-2">{wall.city || "N/A"}</td>
                                    <td className="border border-gray-300 p-2">{wall.pincode || "N/A"}</td>
                                    <td className="border border-gray-300 p-2">{wall.owner_username || "N/A"}</td>
                                    <td className="border border-gray-300 p-2 flex space-x-2">
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !loading && <p className="text-center text-blue-900">No pending walls for approval.</p>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
