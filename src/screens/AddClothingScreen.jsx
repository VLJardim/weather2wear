/**
 * ADD CLOTHING SCREEN - FORM TO ADD NEW CLOTHING ITEMS
 * 
 * This screen handles adding new clothing items to the user's wardrobe.
 * Flow:
 * 1. User taps "Add Clothing" tab → Camera/gallery modal appears
 * 2. User selects/takes photo → Navigates to this screen with image
 * 3. User fills out form (name, category, colors, etc.) → Item saved
 * 
 * Features:
 * - Shows selected image preview
 * - Form to enter clothing details
 * - Empty state when no image selected
 * - Saves to wardrobe context when submitted
 * 
 * Components used:
 * - ClothingForm: Main form component for clothing details
 * - MyFont: Custom typography component
 */

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// Custom components
import ClothingForm from '../components/forms/ClothingForm'; // Main form for clothing details
import MyFont from "../components/forms/MyFont"; // ✅ Custom typography

export default function AddClothingScreen() {
  const navigation = useNavigation();
  const route = useRoute(); // Access route params
  
  // State to store the selected image URI
  const [selectedImage, setSelectedImage] = useState(null);

  // Get image from navigation params when screen loads
  useEffect(() => {
    if (route.params?.selectedImage) {
      setSelectedImage(route.params.selectedImage);
    }
  }, [route.params]);

  // Handler when user submits the clothing form
  const handleFormSubmit = (itemData) => {
    console.log('Adding item to wardrobe:', itemData);
    alert('Item added to wardrobe successfully!');
    setSelectedImage(null);       // Clear selected image
    navigation.navigate('Home');  // Return to home screen
  };

  // Handler when user cancels the form
  const handleFormCancel = () => {
    setSelectedImage(null);       // Clear selected image
    navigation.navigate('Home');  // Return to home screen
  };

  // EMPTY STATE - Show when no image is selected
  if (!selectedImage) {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logoo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <MyFont style={styles.emptyText}>
          Tap the Add Clothing button to select an image
        </MyFont>
      </View>
    );
  }

  // MAIN VIEW - Show form when image is selected
  return (
    <View style={styles.container}>
      <ClothingForm
        image={selectedImage}        // Pass selected image to form
        onSubmit={handleFormSubmit}  // Form submission handler
        onCancel={handleFormCancel}  // Form cancel handler
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
