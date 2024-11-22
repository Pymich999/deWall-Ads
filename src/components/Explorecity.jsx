import React from 'react';


const ExploreCities = () => {
  const categories = ["Mathura", "Patti Pratapgarh", "Parev", "More"];

  return (
    <div className="px-4 mt-4">
      <h2 className="text-lg font-bold mb-3">Explore Cities</h2>
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {categories.map((category, index) => (
          <button
            key={index}
            className="bg-white text-blue-600 font-medium px-4 py-2 border border-gray-300 rounded-full shadow hover:bg-blue-600 hover:text-white transition duration-300"
          >
            {category}
          </button>
        ))}
        <a
          href="/view-all"
          className="text-blue-500 font-medium whitespace-nowrap self-center"
        >
          View All
        </a>
      </div>
    </div>
  );
};

export default ExploreCities;
