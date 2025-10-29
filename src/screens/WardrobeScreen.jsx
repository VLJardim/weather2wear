/**
 * WARDROBE SCREEN - BROWSE AND MANAGE CLOTHING COLLECTION
 * 
 * This screen allows users to:
 * - View all their clothing items in a grid layout
 * - Filter items by category, color, and season
 * - Toggle between all items and favorites only
 * - See their profile information
 * 
 * Components used:
 * - ProfileCard: Shows user profile info
 * - FilterBar: Controls for filtering and favorites
 * - FilterOverlay: Modal for setting detailed filters
 * - GridContainer: Displays clothing items in a grid
 * 
 * State management:
 * - Uses WardrobeContext for clothing data
 * - Uses FavoritesContext for favorite items
 */

// src/screens/WardrobeScreen.jsx
import React, { useState, useLayoutEffect } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Custom components for the wardrobe interface
import ScreenWrapper from "../components/Layout/ScreenWrapper";     // Layout wrapper
import ProfileCard from "../components/ProfileCard";               // User profile display
import FilterBar from "../components/FilterBar";                   // Filter controls
import FilterOverlay from "../components/Layout/FilterOverlay";    // Filter modal
import GridContainer from "../components/GridContainer";           // Grid of clothing items

// Context hooks for state management
import { useWardrobe } from "../context/WardrobeContext";    // Access clothing data
import { useFavorites } from "../context/FavoritesContext"; // Access favorites
import { wardrobeData } from "../data/WardrobeData"; // ✅ fallback data if no user items

export default function WardrobeScreen() {
  const navigation = useNavigation();
  
  // Get clothing items and favorites from context
  const { clothing } = useWardrobe();    // All clothing items
  const { favorites } = useFavorites();  // User's favorite items
  
  // Local state for UI controls
  const [filterVisible, setFilterVisible] = useState(false);  // Show/hide filter modal
  const [showFavorites, setShowFavorites] = useState(false);  // Toggle favorites view
  const [filters, setFilters] = useState({                    // Current filter settings
    category: "all",  // Filter by clothing category (top, bottom, etc.)
    color: "all",     // Filter by color
    season: "all",    // Filter by season (summer, winter, etc.)
  });

  // Configure navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Wardrobe",
      headerShown: false, // Hide default header, we use custom layout
    });
  }, [navigation]);

  // Handler for applying new filters from the filter modal
  const handleFilterApply = (newFilters) => {
    console.log("🎛️ Filter applied:", newFilters);
    setFilters(newFilters);
    setFilterVisible(false); // Close the filter modal
  };

  // Use clothing from context, fallback to empty array if not loaded
  const actualWardrobe = clothing || [];
  console.log("🧥 Wardrobe from context:", clothing?.length || 0);
  console.log("🧩 Active filters:", filters);

  // FILTERING LOGIC - Apply user-selected filters to clothing items
  const filteredItems = actualWardrobe.filter((item) => {
  console.log(`🔎 Checking item: ${item.name} (${item.category})`);

  // CATEGORY FILTER - Check if item matches selected category
  if (filters.category && filters.category !== "all") {
    // Normalize category names (remove plurals, case-insensitive)
    const normalizedItemCategory =
      item.category?.toLowerCase()?.replace(/s$/, "") || "";
    const normalizedFilterCategory =
      filters.category?.toLowerCase()?.replace(/s$/, "") || "";

    if (normalizedItemCategory !== normalizedFilterCategory) {
      console.log(`❌ Filtered out: category mismatch (${item.category})`);
      return false;
    }
  }

  // COLOR FILTER - Check if item has the selected color
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

  // SEASON FILTER - Check if item is suitable for selected season
  if (filters.season && filters.season !== "all") {
    const normalizedSeason = filters.season?.toLowerCase?.() || "";
    // Handle both single season and array of seasons
    const itemSeasons = Array.isArray(item.season)
      ? item.season.map((s) => s?.toLowerCase?.())
      : [item.season?.toLowerCase?.()];

    if (!itemSeasons.includes(normalizedSeason)) {
      console.log(`❌ Filtered out: season mismatch (${item.season})`);
      return false;
    }
  }

  console.log(`✅ Passed filters: ${item.name}`);
  return true; // Item passed all filters
});

  console.log("✅ Filtered item count:", filteredItems.length);

  // DETERMINE WHAT TO DISPLAY
  // Priority: favorites > user's wardrobe > fallback dataset
  const displayedItems = showFavorites
    ? favorites                          // Show only favorites
    : actualWardrobe.length === 0       
    ? wardrobeData                      // No user items, show sample data
    : filteredItems;                    // Show filtered user items

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logoo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* User Profile Section */}
          <View style={styles.section}>
            <ProfileCard />
          </View>

          {/* Filter and Favorites Controls */}
          <View style={styles.section}>
            <FilterBar
              onFilterPress={() => setFilterVisible(true)}        // Open filter modal
              onFavoritesPress={() => setShowFavorites((s) => !s)} // Toggle favorites view
            />
          </View>

          {/* Clothing Items Grid */}
          <View style={styles.section}>
            <GridContainer items={displayedItems} />
          </View>
        </ScrollView>

        {/* Filter Modal Overlay */}
        <FilterOverlay
          isVisible={filterVisible}           // Controls modal visibility
          filters={filters}                   // Current filter state
          onClose={() => setFilterVisible(false)}  // Close modal handler
          onApplyFilters={handleFilterApply}  // Apply new filters handler
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
