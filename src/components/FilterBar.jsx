// src/components/FilterBar.jsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MyFont from "./forms/MyFont"; // ✅ Import MyFont

const FilterBar = ({ onFilterPress, onFavoritesPress }) => {
  return (
    <View style={styles.container}>
      {/* 🔍 Filter Button */}
      <TouchableOpacity style={styles.button} onPress={onFilterPress}>
        <Ionicons name="filter-outline" size={20} color="#333" />
        <MyFont style={styles.text}>Filter</MyFont>
      </TouchableOpacity>

      {/* ❤️ Favorites Button */}
      <TouchableOpacity style={styles.button} onPress={onFavoritesPress}>
        <Ionicons name="heart-outline" size={20} color="#333" />
        <MyFont style={styles.text}>Favorite</MyFont>
      </TouchableOpacity>
    </View>
  );
};

export default FilterBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 4,
  },
  text: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
});
