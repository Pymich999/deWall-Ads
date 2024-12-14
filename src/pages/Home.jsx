import React, { useEffect, useState } from "react";
import fetchWallList from "../components/Fetchwalllist";
import WallItem from "../components/WallItem";
import CategoryTabs from "../components/Category";
import BenefitsSection from "../components/Benefit";
import Howto from "../components/Howtouse";
import FeaturedWalls from "../components/Featuredwalls";
import ExploreCities from "../components/Explorecity";
import CallToAction from "../components/Homefooter";
import { useNavigate } from "react-router-dom";
import { MapPinIcon, ShareIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import useLocation from "../Hooks/Location"; //Import the custom hook
import { createOrGetChat, createChat } from "../firestoreFunctions";
import { useAuth } from "../context/AuthContext";

const WallList = () => {
  const [wallList, setWallList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWalls, setFilteredWalls] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const { currentUser, loading } = useAuth(); // Fetch the logged-in user
  const navigate = useNavigate();
  const { location, error } = useLocation();

  useEffect(() => {
    const getWalls = async () => {
      try {
        const walls = await fetchWallList();
        console.log("Wall List Data:", walls);
        setWallList(walls);
      } catch (error) {
        console.error("Error fetching walls:", error);
      }
    };
    getWalls();
  }, []);

  useEffect(() => {
    const filtered = wallList.filter(
      (wall) =>
        wall.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedLocation || wall.city === selectedLocation) &&
        wall.hide === false // Only show walls with hide === false
    );
    setFilteredWalls(filtered);
  }, [searchQuery, selectedLocation, wallList]);


  const handleChat = async (recipientUserId) => {
    if (loading) {
      console.error("Authentication data still loading");
      return;
    }

    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    try {
      const chatId = await createOrGetChat(recipientUserId);
      navigate(`/chats/${chatId}`);
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  };





  return (
    <div className="homepage">
      {/* Homepage Header */}
      <header className="bg-blue-600 p-4 text-white">
        <h2 className="text-lg font-bold mb-4 text-left">deWallAds</h2>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>
              {location
                ? `${location.state || "Unknown State"}, ${location.country || "Unknown Country"}`
                : error || "Fetching location..."}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center p-4">
            <button
              className="flex items-center"
              onClick={() => handleChat("recipientUserId")} // Replace with dynamic recipient ID
            >
              <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
              <span>Chat</span>
            </button>
            <button className="flex items-center text-sm">
              <ShareIcon className="h-5 w-5 mr-2" />
              Share
            </button>
          </div>

        </div>
        <div className="mt-4 flex justify-center">
          <input
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md"
            placeholder="Search Wall by (City, Pincode...)"
            onClick={() => navigate("/search")}
            readOnly
          />
        </div>
      </header>

      {/* Categories */}
      <CategoryTabs />

      {/* Explore Cities */}
      <ExploreCities />

      {/* Featured Walls */}
      <FeaturedWalls wallList={wallList} />

      {/* How to */}
      <Howto />

      {/* All Walls */}
      <div className="featured-walls p-6">
        <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
        <div className="wall-list p-4 flex overflow-x-auto space-x-4 scroll-smooth shadow-inner">
          {filteredWalls.length > 0 ? (
            filteredWalls.map((wall) => (
              <div key={wall.id} className="w-48 md:w-64 flex-shrink-0">
                <WallItem
                  {...wall}
                  onClick={() => navigate(`/wall-details/${wall.id}`)}
                />
              </div>
            ))
          ) : (
            <p className="text-center w-full">No walls found.</p>
          )}
        </div>
      </div>


      {/* Benefits Section */}
      <BenefitsSection />

      {/* Call-to-Action */}
      <CallToAction />
    </div>
  );
};

export default WallList;


