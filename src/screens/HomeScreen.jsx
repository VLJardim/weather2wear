/**
 * HOME SCREEN - MAIN LANDING PAGE OF THE APP
 * 
 * This is the primary screen users see when opening the app.
 * Features:
 * - App logo at the top
 * - Weather widget showing current conditions
 * - Outfit roulette for generating random outfit suggestions
 * 
 * Components used:
 * - WeatherWidget: Shows current weather and temperature
 * - RouletteDisplay: Shows generated outfit and spin button
 * - useRoulette hook: Manages outfit generation logic
 */

// src/screens/HomeScreen.jsx
import React from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Handles device notches/safe areas
import { useNavigation } from "@react-navigation/native";

// Custom components
import WeatherWidget from "../components/Layout/WeatherWidget";   // Displays weather info
import { useRoulette } from "../hooks/useRoulette";              // Custom hook for outfit generation
import RouletteDisplay from "../components/Layout/RouletteDisplay"; // Shows outfit and spin button
import MyFont from "../components/forms/MyFont"; // ✅ Import MyFont for custom typography

export default function HomeScreen() {
  const navigation = useNavigation();
  
  // Get outfit generation functions from custom hook
  const { spinRoulette, isSpinning, currentOutfit } = useRoulette();

  // Hide the default navigation header for this screen
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Placeholder handler for weather widget press (future feature)
  const handleWeatherPress = () => {
    alert("Weather details coming soon!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"      // Allows taps while keyboard is open
        contentInsetAdjustmentBehavior="automatic" // Handles iOS keyboard adjustments
      >
        <View style={styles.container}>
          {/* App Logo - displays the Weather2Wear branding */}
          <Image
            source={require("../../assets/logoo.png")}
            style={styles.logo}
            resizeMode="contain" // Keeps aspect ratio
          />
          </View>
          {/* Weather Widget - shows current weather conditions and temperature */}
          <WeatherWidget onPress={handleWeatherPress} />

          {/* Outfit Roulette - main feature for generating outfit suggestions */}
          <RouletteDisplay
            outfit={currentOutfit}  // Currently generated outfit
            isSpinning={isSpinning} // Loading state during generation
            onSpin={spinRoulette}   // Function to generate new outfit
          />
          
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    alignItems: "stretch",
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
    paddingTop: 20,
  },
  logo: {
    width: 250,
    height: 100,
    alignSelf: "center",
  
  },
  appname: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  actionArea: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  spinSection: {
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  quickActions: {
    marginHorizontal: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});
