import React, { createContext, useState, useContext, useEffect } from "react";
import { wardrobeData } from "../data/WardrobeData"; // ✅ Import real dataset

// Create context
const WardrobeContext = createContext();

/**
  Provider that manages clothing data and outfit generation.
 */
export const WardrobeProvider = ({ children }) => {
  const [clothing, setClothing] = useState([]); // starts empty
  const [currentOutfit, setCurrentOutfit] = useState(null);

  // Load full wardrobeData once at mount
  useEffect(() => {
    console.log("👕 Loading wardrobe dataset...");
    setClothing(wardrobeData);
  }, []);

  /**
   Randomly generate an outfit with one item from each category.
   */
  const generateOutfit = () => {
    if (!clothing || clothing.length === 0) {
      console.log("⚠️ No clothing found — cannot generate outfit");
      setCurrentOutfit(null);
      return;
    }

    const categories = [...new Set(clothing.map((item) => item.category))];
    const outfit = categories.map((category) => {
      const items = clothing.filter((item) => item.category === category);
      return items[Math.floor(Math.random() * items.length)];
    });

    console.log("🎯 Generated outfit:", outfit);
    setCurrentOutfit(outfit);
  };

  /**
    Add a new clothing item to the wardrobe.
   */
  const addClothingItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      image: item.image || null,
    };
    setClothing((prev) => [...prev, newItem]);
  };

  /**
    Remove a clothing item by its ID.
   */
  const removeClothingItem = (id) => {
    setClothing((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   Clear the current outfit (optional helper).
   */
  const clearOutfit = () => {
    setCurrentOutfit(null);
  };

  //  Debug log to confirm what’s loaded
  useEffect(() => {
    console.log(`📦 Wardrobe now has ${clothing.length} items`);
  }, [clothing]);

  return (
    <WardrobeContext.Provider
      value={{
        clothing,
        setClothing,
        addClothingItem,
        removeClothingItem,
        currentOutfit,
        generateOutfit,
        clearOutfit,
        setCurrentOutfit, // used by useRoulette
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
};

/**
 Custom hook for accessing wardrobe data.
 */
export const useWardrobe = () => {
  const context = useContext(WardrobeContext);
  if (!context) {
    console.warn(
      "⚠️ useWardrobe() must be used inside a <WardrobeProvider>. Returning fallback values."
    );
    return {
      clothing: [],
      addClothingItem: () => {},
      removeClothingItem: () => {},
      generateOutfit: () => {},
      clearOutfit: () => {},
      currentOutfit: null,
      setCurrentOutfit: () => {},
    };
  }
  return context;
};
