// src/utils/outfitGenerator.js
import { CATEGORIES } from "./constants";

/**
 * outfitGenerator.js
 * Core logic for building an outfit based on wardrobe and weather type.
 * It’s used by the roulette hook to “spin” and pick an outfit combination.
 */

/**
 * @param {Array} wardrobe - array of clothing objects
 * @param {string} weatherType - one of "cold", "mild", "warm"
 * @returns {Array} randomly selected outfit pieces
 */
export const generateOutfit = (wardrobe, weatherType) => {
  // 1. Filter wardrobe items that fit current weather
  const filtered = wardrobe.filter((item) => item.weatherType === weatherType);

  // 2. From each category, pick one random piece
  const outfit = CATEGORIES.map((category) => {
    const options = filtered.filter((item) => item.category === category);
    if (options.length === 0) return null;
    return options[Math.floor(Math.random() * options.length)];
  }).filter(Boolean);

  return outfit;
};
