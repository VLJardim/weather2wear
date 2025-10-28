import React, { useRef, useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../../context/FavoritesContext";
import MyFont from "../forms/MyFont";
import wardrobeData from "../../data/WardrobeData"; // ✅

const placeholders = [
  require("../../assets-app/images/placeholder1.png"),
  require("../../assets-app/images/placeholder2.png"),
  require("../../assets-app/images/placeholder3.png"),
  require("../../assets-app/images/placeholder4.png"),
];

const ClothingCard = ({ id, imageSource, category, isSpinning = false, cardWidth }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isItemFavorite = isFavorite(id);

  const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];

  // ✅ Get correct data from wardrobe database
  const itemData = wardrobeData.find((item) => item.id === id);
  const image = itemData?.image || imageSource || randomPlaceholder;
  const categoryLabel = itemData?.category || category || "No Item";

  const spinValue = useRef(new Animated.Value(0)).current;
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    let loopingAnimation;

    if (isSpinning) {
      loopingAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        })
      );
      loopingAnimation.start();
    } else {
      spinValue.stopAnimation((currentValue) => {
        const remainder = currentValue % 1;
        Animated.timing(spinValue, {
          toValue: remainder + (1 - remainder),
          duration: 500,
          useNativeDriver: true,
        }).start(() => spinValue.setValue(0));
      });
    }

    return () => {
      if (loopingAnimation) loopingAnimation.stop();
    };
  }, [isSpinning]);

  const imageSize = cardWidth * 0.8;

  const handleFavoritePress = () => {
    toggleFavorite({ id, imageSource: image, category: categoryLabel });
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          width: cardWidth || 100,
          height: (cardWidth || 100) + 40,
          transform: [{ rotate: spin }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={handleFavoritePress}
      >
        <Ionicons
          name={isItemFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isItemFavorite ? "#6F8D6B" : "gray"}
        />
      </TouchableOpacity>

      <Image
        source={image}
        style={[styles.image, { width: imageSize, height: imageSize }]}
      />

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
