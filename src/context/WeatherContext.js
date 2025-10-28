import React, { createContext, useState, useContext, useEffect } from "react";
import { getCurrentLocation } from "../services/locationService";
import { getWeatherByCoordinates } from "../services/weatherService";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
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
