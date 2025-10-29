/**
 * CLOTHING CARD - DISPLAYS INDIVIDUAL CLOTHING ITEMS
 * 
 * This reusable component shows a single clothing item with:
 * - Item image (with fallback to random placeholder)
 * - Category label (top, bottom, shoes, etc.)
 * - Heart icon for favorites (filled if favorited)
 * - Spinning animation during outfit generation
 * - Responsive sizing based on container width
 * 
 * Props:
 * - id: Unique identifier for the clothing item
 * - imageSource: URI or require() for the item image
 * - category: Category name to display as label
 * - isSpinning: Boolean to show spinning animation
 * - cardWidth: Width for responsive sizing
 * 
 * Features:
 * - Integrates with FavoritesContext for heart functionality
 * - Looks up additional data from WardrobeData by ID
 * - Smooth animations for spinning and stopping
 */

import React, { useRef, useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../../context/FavoritesContext"; // Favorite functionality
import MyFont from "../forms/MyFont";                         // Custom typography
import wardrobeData from "../../data/WardrobeData"; // ✅ Wardrobe database for lookups

// Placeholder images shown when no item image is available
const placeholders = [
  require("../../assets-app/images/placeholder1.png"),
  require("../../assets-app/images/placeholder2.png"),
  require("../../assets-app/images/placeholder3.png"),
  require("../../assets-app/images/placeholder4.png"),
];

const ClothingCard = ({ id, imageSource, category, isSpinning = false, cardWidth }) => {
  // Get favorites functionality from context
  const { toggleFavorite, isFavorite } = useFavorites();
  const isItemFavorite = isFavorite(id);

  // Select random placeholder image if no real image available
  const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];

  // Look up additional item data from wardrobe database
  const itemData = wardrobeData.find((item) => item.id === id);
  const image = itemData?.image || imageSource || randomPlaceholder;     // Image priority: database > prop > placeholder
  const categoryLabel = itemData?.category || category || "No Item";     // Category priority: database > prop > fallback

  // Animation setup for spinning effect
  const spinValue = useRef(new Animated.Value(0)).current;
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Full rotation
  });

  // Handle spinning animation based on isSpinning prop
  useEffect(() => {
    let loopingAnimation;

    if (isSpinning) {
      // Start continuous spinning while generating outfit
      loopingAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 450,           // Speed of rotation
          useNativeDriver: true,   // Better performance
        })
      );
      loopingAnimation.start();
    } else {
      // Stop spinning smoothly when outfit generation completes
      spinValue.stopAnimation((currentValue) => {
        const remainder = currentValue % 1;
        Animated.timing(spinValue, {
          toValue: remainder + (1 - remainder), // Complete the current rotation
          duration: 500,
          useNativeDriver: true,
        }).start(() => spinValue.setValue(0)); // Reset to 0 for next spin
      });
    }

    // Cleanup animation on unmount
    return () => {
      if (loopingAnimation) loopingAnimation.stop();
    };
  }, [isSpinning]);

  // Calculate image size as percentage of card width
  const imageSize = cardWidth * 0.8;

  // Handler for heart icon press - toggle favorite status
  const handleFavoritePress = () => {
    toggleFavorite({ id, imageSource: image, category: categoryLabel });
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          width: cardWidth || 100,              // Responsive width
          height: (cardWidth || 100) + 40,      // Height includes space for label
          transform: [{ rotate: spin }],        // Apply spinning animation
        },
      ]}
    >
      {/* Heart icon for favorites - positioned in top-right corner */}
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={handleFavoritePress}
      >
        <Ionicons
          name={isItemFavorite ? "heart" : "heart-outline"} // Filled or outline based on favorite status
          size={20}
          color={isItemFavorite ? "#6F8D6B" : "gray"}      // Green if favorited, gray if not
        />
      </TouchableOpacity>

      {/* Clothing item image */}
      <Image
        source={image}
        style={[styles.image, { width: imageSize, height: imageSize }]}
      />

      {/* Category label below image */}
      <MyFont style={styles.label}>{categoryLabel}</MyFont>
    </Animated.View>
  );
};

export default ClothingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    position: "relative",
  },
  image: {
    borderRadius: 8,
    marginTop: 8,
    resizeMode: "cover",
  },
  label: {
    marginVertical: 8,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 2,
  },
});
