import React, { useState } from 'react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import WallItem from '../components/Wallitem';
import { useNavigate } from 'react-router-dom';

const SearchWall = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchTerm.trim() === '') return; // Prevent empty searches

    setIsLoading(true);
    try {
      // Perform a Firestore query to search walls by tags
      const q = query(
        collection(db, 'dewall', 'database', 'wall_list'),
        where('tags', 'array-contains', searchTerm)
      );

      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching walls:', error);
      alert('Failed to fetch search results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWallClick = (wallId) => {
    navigate(`/wall-details/${wallId}`);
  };

  return (
    <div className="search-wall max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md border border-blue-100 space-y-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Search Walls</h2>

      <form onSubmit={handleSearch} className="flex items-center space-x-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by tags (e.g., city, district)"
          className="flex-grow p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Search
        </button>
      </form>

      {isLoading ? (
        <p className="text-center text-blue-600 font-semibold">Searching...</p>
      ) : (
        <div className="wall-list grid grid-cols-1 gap-6">
          {searchResults.length > 0 ? (
            searchResults.map((wall) => (
              <WallItem
                key={wall.id}
                city={wall.city}
                state={wall.state}
                pincode={wall.pincode}
                photo_urls={wall.photo_urls}
                size={wall.size}
                timestamp={wall.timestamp}
                onClick={() => handleWallClick(wall.id)} // Pass the wall ID
              />
            ))
          ) : (
            <p className="text-blue-700 font-semibold text-center">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWall;
