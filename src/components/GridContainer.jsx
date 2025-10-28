// src/components/GridContainer.jsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ClothingCard from "./Layout/ClothingCard";

const COLUMNS = 3;      // how many cards per row
const GAP = 10;         // space between cards horizontally + vertically

export default function GridContainer({ items = [] }) {
  const [containerWidth, setContainerWidth] = useState(0);

  // ⬇️ calculate card width based on the measured width of the container
  const cardWidth =
    containerWidth > 0
      ? ((containerWidth - (COLUMNS - 1) * GAP) / COLUMNS) * 0.97 // tiny buffer to avoid wrap glitches
      : 0;

  return (
    <View
      style={styles.grid}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {cardWidth > 0 &&
        items.map((item) => (
          <View key={item.id} style={[styles.cardWrapper, { width: cardWidth }]}>
            <ClothingCard
              id={item.id}
              imageSource={item.imageSource}
              category={item.category}
              cardWidth={cardWidth}
              isSpinning={false} // ← ADD THIS: Always false on wardrobe screen
            />
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: GAP,
  },
  cardWrapper: {
    marginBottom: GAP,
  },
});
