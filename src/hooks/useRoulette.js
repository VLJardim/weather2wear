// src/hooks/useRoulette.js
import { useState } from "react";
import { useWardrobe } from "../context/WardrobeContext";
import { useWeather } from "../context/WeatherContext";
import { wardrobeData } from "../data/WardrobeData";
import { generateWeatherAwareOutfit } from "../utils/spinLogic";

export const useRoulette = () => {
  const { clothing = [], currentOutfit, setCurrentOutfit, generateOutfit } = useWardrobe?.() || {};
  const { weather } = useWeather?.() || { weather: null };

  const [isSpinning, setIsSpinning] = useState(false);
  const [localOutfit, setLocalOutfit] = useState(null);

  const spinRoulette = () => {
    const pool = Array.isArray(clothing) && clothing.length ? clothing : wardrobeData;

    setIsSpinning(true);

    setTimeout(() => {
      // Weather-aware pick
      const outfit = generateWeatherAwareOutfit(pool, {
        temperature: weather?.temperature ?? 18,
        condition: weather?.condition ?? "clear",
      });

      // Prefer context setter if available, else local fallback
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

  return { spinRoulette, isSpinning, currentOutfit: resolvedOutfit };
};
