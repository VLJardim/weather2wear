// src/screens/HomeScreen.jsx
import React from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import WeatherWidget from "../components/Layout/WeatherWidget";
import { useRoulette } from "../hooks/useRoulette";
import RouletteDisplay from "../components/Layout/RouletteDisplay";
import MyFont from "../components/forms/MyFont"; // ✅ Import MyFont

export default function HomeScreen() {
  const navigation = useNavigation();
  const { spinRoulette, isSpinning, currentOutfit } = useRoulette();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleWeatherPress = () => {
    alert("Weather details coming soon!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.container}>
          {/*  Logo */}
          <Image
            source={require("../../assets/logoo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          </View>
          {/* Weather Widget */}
          <WeatherWidget onPress={handleWeatherPress} />

          {/* Outfit Roulette Display */}
          <RouletteDisplay
            outfit={currentOutfit}
            isSpinning={isSpinning}
            onSpin={spinRoulette}
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
