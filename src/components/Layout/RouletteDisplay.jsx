/**
 * ROULETTE DISPLAY - SHOWS GENERATED OUTFIT AND SPIN BUTTON
 * 
 * This component displays the randomly generated outfit as a grid of clothing cards.
 * Features:
 * - Shows outfit items in a 2-column grid layout
 * - Dynamically sizes cards based on container width
 * - Sorts items in logical order (dress/top → bottom → outerwear → shoes → accessories)
 * - Shows spinning animation while generating outfit
 * - "SPIN FOR AN OUTFIT" button to generate new outfits
 * 
 * Props:
 * - outfit: Object with outfit items by category {top: item, bottom: item, etc.}
 * - isSpinning: Boolean indicating if outfit generation is in progress
 * - onSpin: Function to call when spin button is pressed
 * 
 * Uses ClothingCard component to display individual items
 */

// src/components/Layout/RouletteDisplay.jsx
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ClothingCard from "./ClothingCard";  // Individual clothing item display
import MyFont from "../forms/MyFont"; // ✅ Custom typography

export default function RouletteDisplay({ outfit, isSpinning, onSpin }) {
  // State to track container width for responsive card sizing
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Layout constants for grid
  const CARD_MARGIN = 15;
  const COLUMNS = 2;

  // Calculate card width based on container size for responsive layout
  const CARD_WIDTH =
    containerWidth > 0
      ? ((containerWidth - (COLUMNS + 1) * CARD_MARGIN) / COLUMNS) * 0.9
      : 0;

  // Transform outfit object into displayable array with proper sorting
  // Converts {top: item, bottom: item, ...} to [{id, category, image}, ...]
  const displayedItems = outfit
    ? Object.entries(outfit)
        // Sort items in logical visual order for the outfit display
        .sort(([keyA], [keyB]) => {
          const order = ["dress", "top", "bottom", "outer", "shoes", "accessory"];
          return order.indexOf(keyA) - order.indexOf(keyB);
        })
        .map(([key, item]) => ({
          id: item?.id || key,     // Use item ID or category as fallback
          category: key,           // Category name (top, bottom, etc.)
          image: item?.image,      // Image URI for the clothing item
        }))
    : [];

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)} // Measure container for responsive sizing
    >
      {/* Render clothing cards only when width is calculated */}
      {CARD_WIDTH > 0 &&
        displayedItems.map(({ id, category, image }) => (
          <View key={id} style={styles.cardContainer}>
            <ClothingCard
              id={id}
              imageSource={image}      // Image to display
              category={category}      // Category for labeling
              isSpinning={isSpinning} // Show spinning animation
              cardWidth={CARD_WIDTH}  // Responsive card width
            />
          </View>
        ))}

      {/* Show spin button only when not currently spinning */}
      {!isSpinning && (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.spinButton}
            onPress={onSpin}         // Trigger outfit generation
            activeOpacity={0.85}     // Visual feedback on press
          >
            <MyFont style={styles.spinButtonText}>SPIN FOR AN OUTFIT</MyFont>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  cardContainer: {
    margin: 8,
  },
  buttonWrapper: {
    marginTop: 50,
    width: "90%",
    alignSelf: "center",
    zIndex: 10,
    elevation: 10,
  },
  spinButton: {
    backgroundColor: "#6F8D6B",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  spinButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
