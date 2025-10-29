/**
 * USE ROULETTE HOOK - OUTFIT GENERATION LOGIC
 * 
 * This custom hook handles the "roulette" functionality for generating random outfits.
 * It combines clothing data with weather conditions to create weather-appropriate outfits.
 * 
 * Features:
 * - Uses weather data to influence outfit choices
 * - Falls back to sample data if user has no clothing items
 * - Shows spinning animation during generation
 * - Integrates with WardrobeContext and WeatherContext
 * - Uses sophisticated spinLogic for weather-aware outfit generation
 * 
 * Returns:
 * - spinRoulette: Function to generate new outfit
 * - isSpinning: Boolean indicating if generation is in progress
 * - currentOutfit: Currently generated outfit object
 * 
 * Used by: HomeScreen (main roulette functionality)
 */

// src/hooks/useRoulette.js
import { useState } from "react";
import { useWardrobe } from "../context/WardrobeContext";    // Access clothing data
import { useWeather } from "../context/WeatherContext";      // Access weather data
import { wardrobeData } from "../data/WardrobeData";         // Fallback clothing data
import { generateWeatherAwareOutfit } from "../utils/spinLogic"; // Smart outfit generation

export const useRoulette = () => {
  // Get clothing data and outfit state from wardrobe context
  const { clothing = [], currentOutfit, setCurrentOutfit, generateOutfit } = useWardrobe?.() || {};
  
  // Get current weather data from weather context
  const { weather } = useWeather?.() || { weather: null };

  // Local state for spinning animation and fallback outfit storage
  const [isSpinning, setIsSpinning] = useState(false);
  const [localOutfit, setLocalOutfit] = useState(null); // Fallback if context unavailable

  // Main function to generate a new outfit
  const spinRoulette = () => {
    // Use user's clothing if available, otherwise use sample data
    const pool = Array.isArray(clothing) && clothing.length ? clothing : wardrobeData;

    setIsSpinning(true); // Start spinning animation

    // Simulate "thinking" time with timeout for better UX
    setTimeout(() => {
      // Generate weather-appropriate outfit using smart algorithm
      const outfit = generateWeatherAwareOutfit(pool, {
        temperature: weather?.temperature ?? 18,  // Default to mild temperature
        condition: weather?.condition ?? "clear", // Default to clear weather
      });

      // Store outfit in context if available, otherwise store locally
      if (typeof setCurrentOutfit === "function") {
        setCurrentOutfit(outfit);           // Preferred: use context
      } else if (typeof generateOutfit === "function") {
        setLocalOutfit(outfit);            // Fallback: legacy function
      } else {
        setLocalOutfit(outfit);            // Fallback: local state
      }

      setIsSpinning(false); // Stop spinning animation
    }, 1200); // 1.2 second delay for spinning effect
  };

  // Return the outfit from context or local state
  const resolvedOutfit = currentOutfit || localOutfit;

  return { 
    spinRoulette,           // Function to generate new outfit
    isSpinning,            // Boolean indicating if generation in progress
    currentOutfit: resolvedOutfit // Current generated outfit
  };
};
