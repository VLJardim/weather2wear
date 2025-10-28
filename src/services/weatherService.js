// src/api/weatherService.js
import axios from 'axios';

const WEATHER_API_KEY = 'da30fec731ffdac7898229422e200833'; // Get from OpenWeatherMap
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch weather data for a given city.
 * @param {string} city - The city name to get weather for.
 * @returns {Promise<object>} - A promise that resolves to the weather data object.
 */
export const getWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric',
      }
    });
    
    return {
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      city: response.data.name,
      country: response.data.sys.country,
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
};

/**
 * Fetch weather data based on coordinates (latitude and longitude).
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<object>} - A promise that resolves to the weather data object.
 */
export const getWeatherByCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: 'metric', // For Celsius
      }
    });
    
    return {
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      city: response.data.name,
      country: response.data.sys.country,
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
};
