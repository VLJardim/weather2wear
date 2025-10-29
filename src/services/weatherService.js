/**
 * WEATHER SERVICE - FETCH WEATHER DATA FROM OPENWEATHERMAP API
 * 
 * This service handles all weather-related API calls using OpenWeatherMap.
 * Provides two main functions:
 * 1. getWeatherByCity - Get weather by city name
 * 2. getWeatherByCoordinates - Get weather by GPS coordinates (preferred)
 * 
 * Returns standardized weather objects with:
 * - temperature (Celsius, rounded)
 * - description ("partly cloudy", "clear sky", etc.)
 * - condition (main category: "Clear", "Clouds", "Rain", etc.)
 * - humidity, windSpeed (additional data)
 * - city, country (location info)
 * 
 * Used by: WeatherContext (manages weather state)
 */

// src/api/weatherService.js
import axios from 'axios';

// OpenWeatherMap API configuration
const WEATHER_API_KEY = 'da30fec731ffdac7898229422e200833'; // Get from OpenWeatherMap
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch weather data for a given city name.
 * Useful for searching weather in specific cities.
 * 
 * @param {string} city - The city name to get weather for.
 * @returns {Promise<object>} - A promise that resolves to standardized weather data object.
 */
export const getWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,                    // City name query
        appid: WEATHER_API_KEY,     // API key for authentication
        units: 'metric',            // Use Celsius instead of Kelvin
      }
    });
    
    // Transform API response into standardized format
    return {
      temperature: Math.round(response.data.main.temp),        // Round temperature to whole number
      description: response.data.weather[0].description,       // "partly cloudy", "clear sky", etc.
      condition: response.data.weather[0].main,               // Main category: "Clear", "Clouds", "Rain"
      humidity: response.data.main.humidity,                  // Humidity percentage
      windSpeed: response.data.wind.speed,                    // Wind speed in m/s
      city: response.data.name,                               // City name from API
      country: response.data.sys.country,                     // Country code (US, DK, etc.)
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data by city');
  }
};

/**
 * Fetch weather data based on GPS coordinates (latitude and longitude).
 * This is the preferred method as it gets weather for the user's exact location.
 * 
 * @param {number} latitude - Latitude coordinate from GPS
 * @param {number} longitude - Longitude coordinate from GPS
 * @returns {Promise<object>} - A promise that resolves to standardized weather data object.
 */
export const getWeatherByCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: latitude,              // GPS latitude
        lon: longitude,             // GPS longitude
        appid: WEATHER_API_KEY,     // API key for authentication
        units: 'metric',            // Use Celsius instead of Kelvin
      }
    });
    
    // Transform API response into standardized format (same as getWeatherByCity)
    return {
      temperature: Math.round(response.data.main.temp),        // Round temperature to whole number
      description: response.data.weather[0].description,       // "partly cloudy", "clear sky", etc.
      condition: response.data.weather[0].main,               // Main category: "Clear", "Clouds", "Rain"
      humidity: response.data.main.humidity,                  // Humidity percentage
      windSpeed: response.data.wind.speed,                    // Wind speed in m/s
      city: response.data.name,                               // City name from API
      country: response.data.sys.country,                     // Country code (US, DK, etc.)
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data by coordinates');
  }
};
