// src/screens/WardrobeScreen.jsx
import React, { useState, useLayoutEffect } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import ScreenWrapper from "../components/Layout/ScreenWrapper";
import ProfileCard from "../components/ProfileCard";
import FilterBar from "../components/FilterBar";
import FilterOverlay from "../components/Layout/FilterOverlay";
import GridContainer from "../components/GridContainer";
import { useWardrobe } from "../context/WardrobeContext";
import { useFavorites } from "../context/FavoritesContext";
import { wardrobeData } from "../data/WardrobeData"; // ✅ fallback data

export default function WardrobeScreen() {
  const navigation = useNavigation();
  const { clothing } = useWardrobe();
  const { favorites } = useFavorites();
  const [filterVisible, setFilterVisible] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    color: "all",
    season: "all",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Wardrobe",
      headerShown: false,
    });
  }, [navigation]);

  const handleFilterApply = (newFilters) => {
    console.log("🎛️ Filter applied:", newFilters);
    setFilters(newFilters);
    setFilterVisible(false);
  };

  const actualWardrobe = clothing || [];
  console.log("🧥 Wardrobe from context:", clothing?.length || 0);
  console.log("🧩 Active filters:", filters);

  // ✅ Filtering logic (improved + normalized)
  const filteredItems = actualWardrobe.filter((item) => {
  console.log(`🔎 Checking item: ${item.name} (${item.category})`);

  // --- 🧭 Category filter (case-insensitive + plural-safe)
  if (filters.category && filters.category !== "all") {
    const normalizedItemCategory =
      item.category?.toLowerCase()?.replace(/s$/, "") || "";
    const normalizedFilterCategory =
      filters.category?.toLowerCase()?.replace(/s$/, "") || "";

    if (normalizedItemCategory !== normalizedFilterCategory) {
      console.log(`❌ Filtered out: category mismatch (${item.category})`);
      return false;
    }
  }

  // --- 🎨 Color filter (case-insensitive)
  if (filters.color && filters.color !== "all") {
    const normalizedFilterColor = filters.color?.toLowerCase?.() || "";
    const hasColor = item.colors?.some(
      (c) => c?.toLowerCase?.() === normalizedFilterColor
    );
    if (!hasColor) {
      console.log(`❌ Filtered out: color mismatch`);
      return false;
    }
  }

  // --- 🌦️ Season filter (case-insensitive + supports arrays)
  if (filters.season && filters.season !== "all") {
    const normalizedSeason = filters.season?.toLowerCase?.() || "";
    const itemSeasons = Array.isArray(item.season)
      ? item.season.map((s) => s?.toLowerCase?.())
      : [item.season?.toLowerCase?.()];

    if (!itemSeasons.includes(normalizedSeason)) {
      console.log(`❌ Filtered out: season mismatch (${item.season})`);
      return false;
    }
  }

  console.log(`✅ Passed filters: ${item.name}`);
  return true;
});

  console.log("✅ Filtered item count:", filteredItems.length);

  // ✅ Display favorites, or full wardrobe, or fallback to dataset
  const displayedItems = showFavorites
    ? favorites
    : actualWardrobe.length === 0
    ? wardrobeData
    : filteredItems;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logoo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.section}>
            <ProfileCard />
          </View>

          <View style={styles.section}>
            <FilterBar
              onFilterPress={() => setFilterVisible(true)}
              onFavoritesPress={() => setShowFavorites((s) => !s)}
            />
          </View>

          <View style={styles.section}>
            <GridContainer items={displayedItems} />
          </View>
        </ScrollView>

        <FilterOverlay
          isVisible={filterVisible}
          filters={filters}
          onClose={() => setFilterVisible(false)}
          onApplyFilters={handleFilterApply}
        />
      </ScreenWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 60,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 15,
  },
});
