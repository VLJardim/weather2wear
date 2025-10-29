
import { useState } from "react";
import { useWardrobe } from "../context/WardrobeContext"; 
import { useWeather } from "../context/WeatherContext"; 
import { wardrobeData } from "../data/WardrobeData";  
import { generateWeatherAwareOutfit } from "../utils/spinLogic"; 

export const useRoulette = () => {
  // Get clothing data and outfit state from wardrobe context
  const { clothing = [], currentOutfit, setCurrentOutfit, generateOutfit } = useWardrobe?.() || {};
  
  // Get current weather data from weather context
  const { weather } = useWeather?.() || { weather: null };

  // Local state for spinning animation and fallback outfit storage
  const [isSpinning, setIsSpinning] = useState(false);
  const [localOutfit, setLocalOutfit] = useState(null); 

  // Main function to generate a new outfit
  const spinRoulette = () => {
    const pool = Array.isArray(clothing) && clothing.length ? clothing : wardrobeData;

    setIsSpinning(true); 

    setTimeout(() => {
      // Generate weather-appropriate outfit using smart algorithm
      const outfit = generateWeatherAwareOutfit(pool, {
        temperature: weather?.temperature ?? 18, 
        condition: weather?.condition ?? "clear", 
      });

      // Store outfit in context if available, otherwise store locally
      if (typeof setCurrentOutfit === "function") {
        setCurrentOutfit(outfit);  
      } else if (typeof generateOutfit === "function") {
        setLocalOutfit(outfit);    
      } else {
        setLocalOutfit(outfit); 
      }

      setIsSpinning(false); 
    }, 1200); 
  };

  const resolvedOutfit = currentOutfit || localOutfit;

  return { 
    spinRoulette,   
    isSpinning,   
    currentOutfit: resolvedOutfit 
  };
};
