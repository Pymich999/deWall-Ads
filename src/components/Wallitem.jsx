import { FaLocationArrow as FaLocationPin, FaClock } from 'react-icons/fa';

const WallItem = ({
  city,
  state,
  pincode,
  photo_urls = [], // Expecting an array
  size = { length: 0, width: 0 }, // Default value to prevent undefined errors
  timestamp,
  onClick, // Optional onClick handler
}) => {
  const displayImage = photo_urls[0] || '/default-image.jpg'; // Fallback to a default image

  const getFormattedTimeElapsed = (timestamp) => {
    if (!timestamp) return 'Unknown upload time';

    const now = new Date();
    const uploadTime = new Date(timestamp.seconds * 1000);
    const timeDifference = now - uploadTime;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) return `Uploaded ${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `Uploaded ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `Uploaded ${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `Uploaded ${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `Uploaded ${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    return 'Uploaded just now';
  };

  return (
    <div
      className="wall-item bg-white rounded-lg shadow-md p-6 border border-blue-100 cursor-pointer"
      onClick={onClick} // Add onClick handler here
    >
      <img
        src={displayImage}
        alt="Wall"
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      <div className="text-blue-900">
        <h2 className="text-xl font-semibold">{size.length}x{size.width} - {city}</h2>
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <FaLocationPin className="h-5 w-5 mr-2 text-blue-500" />
          {state}-{pincode}
        </p>
        <p className="text-sm text-gray-600 flex items-center mb-2">
          <FaClock className="h-5 w-5 mr-2 text-blue-500" />
          {getFormattedTimeElapsed(timestamp)}
        </p>
      </div>
    </div>
  );
};

export default WallItem;


