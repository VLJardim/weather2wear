import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ClothingForm from '../components/forms/ClothingForm';
import MyFont from "../components/forms/MyFont"; // ✅ Import MyFont

export default function AddClothingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedImage, setSelectedImage] = useState(null);

  // 📸 Get image from route params
  useEffect(() => {
    if (route.params?.selectedImage) {
      setSelectedImage(route.params.selectedImage);
    }
  }, [route.params]);

  const handleFormSubmit = (itemData) => {
    console.log('Adding item to wardrobe:', itemData);
    alert('Item added to wardrobe successfully!');
    setSelectedImage(null);
    navigation.navigate('Home');
  };

  const handleFormCancel = () => {
    setSelectedImage(null);
    navigation.navigate('Home');
  };

  // 🪄 Empty state when no image is selected
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

  return (
    <View style={styles.container}>
      <ClothingForm
        image={selectedImage}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
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
