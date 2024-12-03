import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import fetchWallDetails from "../utility/Fetchwalldetails";
import { db, auth } from "../firebase";
import { createOrGetChat, sendMessage} from "../firestoreFunctions";
import { createChat } from "../firestoreFunctions";

const WallDetails = () => {
    const { id } = useParams(); // Get wall ID from the URL params
    const navigate = useNavigate(); // Initialize useNavigate
    const [wallDetails, setWallDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const handleEnquiry = async () => {
        try {
            // Ensure the current user is authenticated
            const currentUser = auth.currentUser;
            if (!currentUser) {
                alert("Please log in to make an enquiry.");
                return;
            }

            const currentUserId = currentUser.uid;
            const ownerId = wallDetails?.owner_uid; // Ensure wallDetails and owner_uid exist
            if (!ownerId) {
                alert("Wall owner details are missing. Cannot proceed with the enquiry.");
                return;
            }

            // Generate enquiry message from wall details
            const wallText = `
    Wall Details:
    City: ${wallDetails?.city || "N/A"}
    District: ${wallDetails?.district || "N/A"}
    Pincode: ${wallDetails?.pincode || "N/A"}
    State: ${wallDetails?.state || "N/A"}
    Locality: ${wallDetails?.locality || "N/A"}
    Price: ₹${wallDetails?.price || "N/A"}
    
    Is this wall still available?
            `;

            // Create or fetch the chat ID
            const chatId = await createOrGetChat(ownerId);

            if (!chatId) {
                // If no chat exists, create a new one
                const newChatId = await createChat(ownerId);
                // Send the pre-filled enquiry message
                await sendMessage(newChatId, currentUserId, wallText);
                navigate(`/chats/${newChatId}`);
            } else {
                // If chat exists, send the enquiry message
                await sendMessage(chatId, currentUserId, wallText);
                navigate(`/chats/${chatId}`);
            }

        } catch (error) {
            console.error("Error making enquiry:", error);
            alert("Failed to make an enquiry. Please try again later.");
        }
    };



    useEffect(() => {
        const getWallDetails = async () => {
            try {
                const details = await fetchWallDetails(id);
                console.log("Wall Details Data:", details);
                setWallDetails(details);
            } catch (err) {
                console.error("Error fetching wall details:", err);
                setError("Failed to load wall details.");

            } finally {
                setLoading(false);
            }
        };
        getWallDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center p-6">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-500 bg-blue-500"></div>;
    }

    if (!wallDetails) {
        return <div className="text-center p-6">Wall details not found.</div>;
    }



    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")} // Navigate to homepage
                    className="mb-6 text-sm text-blue-600 hover:underline"
                >
                    &larr; Back to Home
                </button>

                <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
                    Wall Details
                </h2>

                {/* Wall Photo */}
                {wallDetails.photo_urls ? (
                    <img
                        src={wallDetails.photo_urls}
                        alt="Wall"
                        className="w-full h-64 object-cover rounded-md mb-6"
                    />
                ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 mb-6">
                        No Image Available
                    </div>
                )}

                {/* Wall Info Table */}
                <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                        <tr>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-left">City</th>
                            <td className="border border-gray-300 p-2">{wallDetails.city || "N/A"}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-left">District</th>
                            <td className="border border-gray-300 p-2">{wallDetails.district || "N/A"}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-left">Coordinates</th>
                            <td className="border border-gray-300 p-2">
                                {wallDetails.coordinates
                                    ? `${wallDetails.coordinates._lat}, ${wallDetails.coordinates._long}`
                                    : "N/A"}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-left">Pincode</th>
                            <td className="border border-gray-300 p-2">{wallDetails.pincode || "N/A"}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-left">Available</th>
                            <td className="border border-gray-300 p-2">
                                <span
                                    className={`font-semibold ${wallDetails.available ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {wallDetails.available ? "Yes" : "No"}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-left">Tags</th>
                            <td className="border border-gray-300 p-2">
                                {wallDetails.tags && wallDetails.tags.length > 0
                                    ? wallDetails.tags.join(", ")
                                    : "N/A"}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-left">Owner</th>
                            <td className="border border-gray-300 p-2">{wallDetails.owner_username || "N/A"}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Make Enquiry Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200"
                        onClick={handleEnquiry}
                    >
                        Make Enquiry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WallDetails;

