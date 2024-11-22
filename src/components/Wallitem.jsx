const WallItem = ({ 
  city, 
  district, 
  coordinates, 
  pincode, 
  tags, 
  photo_url, 
  owner_username, 
  available, 
  onClick // Accept onClick as a prop
}) => {
  return (
    <div 
      className="wall-item bg-white rounded-lg shadow-md p-6 border border-blue-100 cursor-pointer" 
      onClick={onClick} // Add onClick handler here
    >
      <img
        src={photo_url || "test.jpg"} // Fallback image
        alt="Wall"
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      <div className="text-blue-900">
        <h2 className="text-xl font-semibold">{city}, {district}</h2>
        <p className="text-sm text-gray-600 mb-2">Coordinates: {coordinates ? `${coordinates._lat}, ${coordinates._long}` : 'N/A'}</p>
        <p className="text-sm text-gray-600">Pincode: {pincode}</p>
        <p className="text-sm text-gray-600">Available: <span className={`font-semibold ${available ? 'text-green-500' : 'text-red-500'}`}>{available ? 'Yes' : 'No'}</span></p>
        <p className="text-sm text-gray-600 mb-2">Owner: {owner_username}</p>
      </div>

      <div className="tags">
        {tags && tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs mr-2">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WallItem;

