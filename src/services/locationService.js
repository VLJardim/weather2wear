/**
 * LOCATION SERVICE - GET USER'S GPS COORDINATES
 * 
 * This service handles GPS location functionality using Expo Location.
 * Used to get the user's current position for weather data.
 * 
 * Process:
 * 1. Request location permissions from user
 * 2. Get current GPS coordinates if permission granted
 * 3. Return latitude/longitude for weather API calls
 * 
 * Error handling:
 * - Throws error if permission denied
 * - Throws error if GPS unavailable
 * 
 * Used by: WeatherContext (to get weather for current location)
 */

import * as Location from 'expo-location';

/**
 * Get the user's current GPS coordinates.
 * Requests permission and returns latitude/longitude.
 * 
 * @returns {Promise<object>} Object with latitude and longitude properties
 * @throws {Error} If permission denied or location unavailable
 */
export const getCurrentLocation = async () => {
  try {
    // Request permission to access device location
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    // Get current GPS position with balanced accuracy (good enough for weather)
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced, // Balance between accuracy and battery usage
    });

    // Return simplified coordinate object
    return {
      latitude: location.coords.latitude,   // GPS latitude
      longitude: location.coords.longitude, // GPS longitude
    };
  } catch (error) {
    throw new Error('Failed to get location: ' + error.message);
  }
};