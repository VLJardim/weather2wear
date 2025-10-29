import { useState } from "react";
import * as ImagePicker from "expo-image-picker"; 
import { Platform } from "react-native";          // Detect platform (iOS/Android/web)

/**
 * Custom hook to handle selecting or capturing images for new clothing items.
 * Manages permissions, camera access, and gallery selection.
 */
export const useImagePicker = () => {
  const [loading, setLoading] = useState(false);

  // Request necessary permissions for camera and photo library access
  const requestPermissions = async () => {
    try {
      if (Platform.OS !== "web") {
        
        const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
        console.log("Camera permission:", cameraResult);

        const mediaResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("Media library permission:", mediaResult);

        return {
          camera: cameraResult.status === "granted",
          mediaLibrary: mediaResult.status === "granted",
        };
      }

      // Web platform doesn't need explicit permission requests
      return { camera: true, mediaLibrary: true };
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return { camera: false, mediaLibrary: false };
    }
  };

  // Function to take a photo using the device camera
  const takePhoto = async () => {
    try {
      setLoading(true);
      console.log("Starting takePhoto...");

      // Check camera permissions first
      const permissions = await requestPermissions();
      if (!permissions.camera) {
        alert("Camera permission is required to take photos.");
        return null;
      }

      console.log("Opening camera...");
      // Launch camera with configuration
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, 
        quality: 0.8,  
        base64: false, 
      });

      console.log("Camera result:", result);

      // Check if user didn't cancel and we got a valid image
      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0].uri; 
      }

      return null;
    } catch (error) {
      console.error("Error taking photo:", error);
      throw error; 
    } finally {
      setLoading(false); 
    }
  };

  // Function to select an image from the device photo gallery
  const pickFromGallery = async () => {
    try {
      setLoading(true); 
      console.log("Starting pickFromGallery...");

      // Check gallery permissions first
      const permissions = await requestPermissions();
      if (!permissions.mediaLibrary) {
        alert("Photo library permission is required to select images.");
        return null;
      }

      console.log("Opening gallery...");
      // Launch gallery with configuration
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], 
        quality: 0.8, 
        base64: false,
      });

      console.log("Gallery result:", result);

      // Check if user didn't cancel and we got a valid image
      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0].uri; 
      }

      return null; // User cancelled or no image selected
    } catch (error) {
      console.error("Error picking from gallery:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  // Return the hook's public interface
  return {
    takePhoto,  
    pickFromGallery, 
    loading, 
  };
};
