import React, { useState, useEffect } from "react";
import 'react-native-gesture-handler';
import { StatusBar } from "react-native";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import { WardrobeProvider } from "./src/context/WardrobeContext";
import { WeatherProvider } from "./src/context/WeatherContext";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Lato_400Regular } from "@expo-google-fonts/lato";
import * as SplashScreen from "expo-splash-screen";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import AddClothingScreen from "./src/screens/AddClothingScreen";
import WardrobeScreen from "./src/screens/WardrobeScreen";

// Modal + image picker
import ImagePickerModal from "./src/components/modals/ImagePickerModal";
import { useImagePicker } from "./src/hooks/useImagePicker";

const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { takePhoto, pickFromGallery, loading } = useImagePicker();
  const [navigation, setNavigation] = useState(null);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": Lato_400Regular,   // 👈 match this name with MyFont.jsx
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; // prevent render until font is ready

  const handleAddClothingPress = () => setModalVisible(true);

  const handleTakePhoto = async () => {
    try {
      const imageUri = await takePhoto();
      if (imageUri) {
        setSelectedImage(imageUri);
        setModalVisible(false);
        navigation?.navigate("Add Clothing", { selectedImage: imageUri });
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      alert("Failed to take photo. Please try again.");
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const imageUri = await pickFromGallery();
      if (imageUri) {
        setSelectedImage(imageUri);
        setModalVisible(false);
        navigation?.navigate("Add Clothing", { selectedImage: imageUri });
      }
    } catch (error) {
      console.error("Error picking from gallery:", error);
      alert("Failed to select image. Please try again.");
    }
  };

  return (
    <FavoritesProvider>
      <WardrobeProvider>
        <WeatherProvider>
          <NavigationContainer ref={(nav) => setNavigation(nav)}>
            <Tab.Navigator
              initialRouteName="Home"
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#6F8D6B",
                tabBarInactiveTintColor: "#999",
                tabBarStyle: {
                  backgroundColor: "#fff",
                  borderTopWidth: 0,
                  elevation: 10,
                  height: 70,
                },
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === "Home") iconName = focused ? "home" : "home-outline";
                  else if (route.name === "Add Clothing") iconName = focused ? "add-circle" : "add-circle-outline";
                  else if (route.name === "Wardrobe") iconName = focused ? "list" : "list-outline";
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
            >
              <Tab.Screen
                name="Add Clothing"
                component={AddClothingScreen}
                listeners={{
                  tabPress: (e) => {
                    e.preventDefault();
                    handleAddClothingPress();
                  },
                }}
                initialParams={{ selectedImage }}
              />
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen 
                name="Wardrobe" 
                component={WardrobeScreen}
                options={{ title: "Wardrobe" }} // ← ADD THIS LINE
              />
            </Tab.Navigator>

            {/* 📸 Global image picker modal */}
            <ImagePickerModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onTakePhoto={handleTakePhoto}
              onChooseFromGallery={handleChooseFromGallery}
              loading={loading}
            />
          </NavigationContainer>
        </WeatherProvider>
      </WardrobeProvider>
    </FavoritesProvider>
  );
}
