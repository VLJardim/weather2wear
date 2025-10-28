// src/components/Layout/FilterOverlay.jsx
import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/filterOverlay.styles";
import MyFont from "../forms/MyFont"; // ✅ Import your custom font component

// 💡 Match categories with ClothingForm
const categories = [
  { id: "tops", name: "Tops", icon: "shirt" },
  { id: "bottoms", name: "Bottoms", icon: "walk" },
  { id: "dresses", name: "Dresses", icon: "woman" },
  { id: "outerwear", name: "Outerwear", icon: "layers" },
  { id: "shoes", name: "Shoes", icon: "footsteps" },
  { id: "accessories", name: "Accessories", icon: "watch" },
];

const seasons = ["Spring", "Summer", "Fall", "Winter", "All Year"];
const colors = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
  "#FFC0CB", "#A52A2A", "#808080", "#000080", "#008000",
];

export default function FilterOverlay({ isVisible, onClose, onApplyFilters }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [nameQuery, setNameQuery] = useState("");

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleApply = () => {
    onApplyFilters({
      category: selectedCategory,
      season: selectedSeason,
      colors: selectedColors,
      name: nameQuery.trim(),
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedSeason(null);
    setSelectedColors([]);
    setNameQuery("");
    onApplyFilters({
      category: "all",
      colors: [],
      season: "all",
      name: "",
    });
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={styles.modal}
    >
      <View style={styles.sheet}>
        <View style={styles.dragHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* 🏷️ Title */}
          <MyFont style={styles.title}>Filter Wardrobe</MyFont>

          {/* 📝 Name Search */}
          <MyFont style={styles.sectionTitle}>Search by name</MyFont>
          <TextInput
            placeholder="Type a name..."
            style={styles.textInput}
            value={nameQuery}
            onChangeText={setNameQuery}
          />

          {/* 👕 Categories */}
          <MyFont style={styles.sectionTitle}>Category</MyFont>
          <View style={styles.filterContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterButton,
                  selectedCategory === cat.id && styles.filterButtonSelected,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id
                  )
                }
              >
                <Ionicons
                  name={cat.icon}
                  size={20}
                  color={selectedCategory === cat.id ? "#fff" : "#6F8D6B"}
                />
                <MyFont
                  style={[
                    styles.filterText,
                    selectedCategory === cat.id && styles.filterTextSelected,
                  ]}
                >
                  {cat.name}
                </MyFont>
              </TouchableOpacity>
            ))}
          </View>

          {/* 🌱 Seasons */}
          <MyFont style={styles.sectionTitle}>Season</MyFont>
          <View style={styles.filterContainer}>
            {seasons.map((season) => (
              <TouchableOpacity
                key={season}
                style={[
                  styles.filterButton,
                  selectedSeason === season && styles.filterButtonSelected,
                ]}
                onPress={() =>
                  setSelectedSeason(selectedSeason === season ? null : season)
                }
              >
                <MyFont
                  style={[
                    styles.filterText,
                    selectedSeason === season && styles.filterTextSelected,
                  ]}
                >
                  {season}
                </MyFont>
              </TouchableOpacity>
            ))}
          </View>

          {/* 🎨 Colors */}
          <MyFont style={styles.sectionTitle}>Color</MyFont>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColors.includes(color) && styles.colorCircleSelected,
                ]}
                onPress={() => toggleColor(color)}
              />
            ))}
          </View>
        </ScrollView>

        {/* 📌 Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <MyFont style={styles.resetButtonText}>Reset</MyFont>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <MyFont style={styles.applyButtonText}>Apply</MyFont>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
