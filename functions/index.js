const functions = require('firebase-functions');
const fetch = require('node-fetch'); // For making API requests

// Cloud Function for Reverse Geocoding
exports.reverseGeocode = functions.https.onCall(async (data, context) => {
  const { latitude, longitude } = data;

  if (!latitude || !longitude) {
    throw new functions.https.HttpsError('invalid-argument', 'Latitude and longitude are required');
  }

  const API_KEY = 'AIzaSyAnkpMy3AfUVLz6OXL5unj3q-TLOi4yIxs'; // Replace with OpenCage or Google Maps API key
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.results && json.results.length > 0) {
      const { state, country } = json.results[0].components;
      return { state, country };
    } else {
      throw new functions.https.HttpsError('not-found', 'No location found for the provided coordinates');
    }
  } catch (error) {
    console.error('Error during reverse geocoding:', error);
    throw new functions.https.HttpsError('internal', 'Unable to perform geocoding');
  }
});


const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");


