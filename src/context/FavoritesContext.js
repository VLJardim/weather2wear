/**
 * FAVORITES CONTEXT - MANAGES USER'S FAVORITE CLOTHING ITEMS/OUTFITS
 * 
 * This context provides:
 * - favorites: Array of favorite items
 * - addToFavorites: Add item to favorites (prevents duplicates)
 * - removeFromFavorites: Remove item from favorites by ID
 * - toggleFavorite: Add if not favorite, remove if already favorite
 * - isFavorite: Check if an item is already favorited
 * 
 * Used by: ClothingCard (heart icon), WardrobeScreen (show favorites)
 */

import React, { createContext, useContext, useState } from "react";

// Create the context for sharing favorites data across the app
const FavoritesContext = createContext();

// Create the provider component that wraps the app
export const FavoritesProvider = ({ children }) => {
  // State to store array of favorite items
  const [favorites, setFavorites] = useState([]);

  // Add item to favorites (only if not already exists)
  const addToFavorites = (item) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === item.id);
      if (!exists) {
        return [...prev, item]; // Add to favorites
      }
      return prev; // Already exists, don't add duplicate
    });
  };

  // Remove item from favorites by its ID
  const removeFromFavorites = (itemId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== itemId));
  };

  // Toggle favorite status - add if not favorite, remove if favorite
  const toggleFavorite = (item) => {
    const isFavorite = favorites.find((fav) => fav.id === item.id);
    if (isFavorite) {
      removeFromFavorites(item.id); // Remove from favorites
    } else {
      addToFavorites(item);          // Add to favorites
    }
  };

  // Check if an item is currently in favorites
  const isFavorite = (itemId) => {
    return favorites.some((fav) => fav.id === itemId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,           // Array of favorite items
        addToFavorites,     // Function to add item to favorites
        removeFromFavorites, // Function to remove item from favorites
        toggleFavorite,     // Function to toggle favorite status
        isFavorite,         // Function to check if item is favorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use favorites context in components
// Must be used inside a FavoritesProvider
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
