import React from 'react';
import { useNavigate } from 'react-router-dom';
import WallItem from './Wallitem';

const FeaturedWalls = ({ wallList }) => {
  const navigate = useNavigate(); // Hook for navigation
  const featuredWalls = wallList.slice(0, 3); // Display first 3 walls as featured

  return (
    <div className="featured-walls p-6">
      <h2 className="text-2xl font-bold mb-4">Featured Walls</h2>
      <div className="wall-list p-6 overflow-x-auto whitespace-nowrap space-x-4 flex scroll-smooth shadow-inner">
        {featuredWalls.map((wall) => (
          <WallItem
            key={wall.id}
            {...wall}
            onClick={() => navigate(`/wall-details/${wall.id}`)} // Add onClick handler
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedWalls;

