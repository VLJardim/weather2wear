/**
 * WEATHER CONTEXT - MANAGES WEATHER DATA AND LOCATION
 * 
 * This context provides:
 * - weather: Current weather data (temperature, conditions, etc.)
 * - loading: Boolean indicating if weather is being fetched
 * - error: Error message if weather fetch fails
 * - refreshWeather: Function to manually refresh weather data
 * 
 * How it works:
 * 1. Gets user's GPS location using locationService
 * 2. Fetches weather data using weatherService
 * 3. Automatically loads weather when app starts
 * 
 * Used by: HomeScreen (display weather), WeatherWidget (show current conditions)
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import { getCurrentLocation } from "../services/locationService";
import { getWeatherByCoordinates } from "../services/weatherService";

const WeatherContext = createContext(); // Create the context for sharing weather data

export const WeatherProvider = ({ children }) => {
  // State to store weather data (temperature, description, etc.)
  const [weather, setWeather] = useState(null);
  // State to store any error messages
  const [error, setError] = useState(null);
  // State to indicate if weather is currently being fetched
  const [loading, setLoading] = useState(false);

  /**
   * 🔁 Refresh weather data based on current location
   */
  const refreshWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // 📍 Get current GPS location
      const location = await getCurrentLocation();

      // 🌤️ Fetch weather data for that location
      const data = await getWeatherByCoordinates(location.latitude, location.longitude);

      // ✅ Update state
      setWeather(data);
    } catch (err) {
      console.log("❌ Failed to fetch weather:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🪄 Fetch weather when the app starts
   */
  useEffect(() => {
    refreshWeather();
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        weather,
        setWeather,
        error,
        loading,
        refreshWeather, // 👈 expose refresh function
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
