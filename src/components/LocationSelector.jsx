import React from 'react';

const LocationSelector = ({ selectedLocation, onSelectLocation }) => {
    const locations = ['City1', 'City2', 'City3', 'City4']; // Replace with actual cities

    return (
        <select
            value={selectedLocation}
            onChange={(e) => onSelectLocation(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
        >
            <option value="">Select a location</option>
            {locations.map((location, index) => (
                <option key={index} value={location}>
                    {location}
                </option>
            ))}
        </select>
    );
};

export default LocationSelector;

