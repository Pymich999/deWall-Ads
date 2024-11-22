import { useState, useEffect } from "react";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=fd2be6e2077943efaccd3d3c88e9805d`
        );
        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
          const { state, country } = data.results[0].components;
          setLocation({ state, country });
        } else {
          setError("Unable to fetch location details");
        }
      } catch (err) {
        setError("Error fetching location");
        console.error(err);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocation(latitude, longitude);
      },
      (err) => {
        setError("Unable to fetch location");
        console.error("Geolocation error:", err);
      }
    );
  }, []);

  return { location, error };
};

export default useLocation;
