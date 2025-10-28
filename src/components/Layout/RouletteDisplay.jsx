// src/components/Layout/RouletteDisplay.jsx
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ClothingCard from "./ClothingCard";
import MyFont from "../forms/MyFont"; // ✅ custom font

export default function RouletteDisplay({ outfit, isSpinning, onSpin }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const CARD_MARGIN = 15;
  const COLUMNS = 2;

  const CARD_WIDTH =
    containerWidth > 0
      ? ((containerWidth - (COLUMNS + 1) * CARD_MARGIN) / COLUMNS) * 0.9
      : 0;

  // 🧠 Determine which cards to render dynamically based on the outfit object
  const displayedItems = outfit
    ? Object.entries(outfit)
        // Sort in a nice order visually
        .sort(([keyA], [keyB]) => {
          const order = ["dress", "top", "bottom", "outer", "shoes", "accessory"];
          return order.indexOf(keyA) - order.indexOf(keyB);
        })
        .map(([key, item]) => ({
          id: item?.id || key,
          category: key,
          image: item?.image,
        }))
    : [];

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {CARD_WIDTH > 0 &&
        displayedItems.map(({ id, category, image }) => (
          <View key={id} style={styles.cardContainer}>
            <ClothingCard
              id={id}
              imageSource={image}
              category={category}
              isSpinning={isSpinning}
              cardWidth={CARD_WIDTH}
            />
          </View>
        ))}

      {!isSpinning && (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.spinButton}
            onPress={onSpin}
            activeOpacity={0.85}
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
