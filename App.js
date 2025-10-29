import React, { useState, useEffect } from "react";
import 'react-native-gesture-handler'; 
import { StatusBar } from "react-native";

import { FavoritesProvider } from "./src/context/FavoritesContext";
import { WardrobeProvider } from "./src/context/WardrobeContext";   
import { WeatherProvider } from "./src/context/WeatherContext";     

// Navigation setup
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Font loading
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
  // State for controlling the image picker modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 
  
  // Custom hook that provides camera and gallery functionality
  const { takePhoto, pickFromGallery, loading } = useImagePicker();
  
  const [navigation, setNavigation] = useState(null);

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    "Lato-Regular": Lato_400Regular, 
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Don't render app until fonts are ready
  if (!fontsLoaded) return null; 

  // Handler for when user taps "Add Clothing" tab - shows camera/gallery modal
  const handleAddClothingPress = () => setModalVisible(true);

  // Handler for taking a photo with camera
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

  // Handler for selecting photo from gallery
  const handleChooseFromGallery = async () => {
    try {
      const imageUri = await pickFromGallery();
      if (imageUri) {
        setSelectedImage(imageUri);         
        setModalVisible(false);            
        // Navigate to Add Clothing screen with the selected image
        navigation?.navigate("Add Clothing", { selectedImage: imageUri });
      }
    } catch (error) {
      console.error("Error picking from gallery:", error);
      alert("Failed to select image. Please try again.");
    }
  };

  return (
    // Wrap entire app in context providers to share state globally
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

                // Configure icons for each tab based on route name
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === "Home") iconName = focused ? "home" : "home-outline";
                  else if (route.name === "Add Clothing") iconName = focused ? "add-circle" : "add-circle-outline";
                  else if (route.name === "Wardrobe") iconName = focused ? "list" : "list-outline";
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
            >
              {/* Add Clothing Tab */}
              <Tab.Screen
                name="Add Clothing"
                component={AddClothingScreen}
                listeners={{
                  tabPress: (e) => {
                    e.preventDefault();  
                    handleAddClothingPress();  
                  },
                }}
                initialParams={{ selectedImage }} // Pass selected image to screen
              />
              {/* Home Tab */}
              <Tab.Screen name="Home" component={HomeScreen} />
              {/* Wardrobe Tab */}
              <Tab.Screen 
                name="Wardrobe" 
                component={WardrobeScreen}
                options={{ title: "Wardrobe" }}
              />
            </Tab.Navigator>

            {/* Global image picker modal - appears over all screens when triggered */}
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
