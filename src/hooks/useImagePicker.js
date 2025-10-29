/**
 * USE IMAGE PICKER HOOK - CAMERA AND GALLERY ACCESS
 * 
 * This custom hook provides easy access to device camera and photo gallery.
 * Handles all permission requests and image selection logic.
 * 
 * Features:
 * - Requests camera and media library permissions
 * - Takes photos with camera
 * - Selects images from gallery
 * - Loading state management
 * - Error handling with user-friendly messages
 * - Platform-specific behavior (web vs mobile)
 * 
 * Returns:
 * - takePhoto: Function to open camera and take photo
 * - pickFromGallery: Function to open gallery and select image
 * - loading: Boolean indicating if operation in progress
 * 
 * Used by: App.js (global image picker modal), AddClothingScreen
 */

// src/hooks/useImagePicker.js
import { useState } from "react";
import * as ImagePicker from "expo-image-picker"; // Expo's image picker library
import { Platform } from "react-native";          // Detect platform (iOS/Android/web)

/**
 * Custom hook to handle selecting or capturing images for new clothing items.
 * Manages permissions, camera access, and gallery selection.
 */
export const useImagePicker = () => {
  // State to track if an image operation is in progress
  const [loading, setLoading] = useState(false);

  // Request necessary permissions for camera and photo library access
  const requestPermissions = async () => {
    try {
      if (Platform.OS !== "web") {
        // Mobile platforms need explicit permissions
        
        // Request camera permissions for taking photos
        const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
        console.log("Camera permission:", cameraResult);

        // Request media library permissions for accessing gallery
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
      setLoading(true); // Show loading state
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images (no videos)
        allowsEditing: false,    // Skip editing step for faster workflow
        quality: 0.8,           // Compress to 80% quality (balance file size/quality)
        base64: false,          // Don't need base64 encoding
      });

      console.log("Camera result:", result);

      // Check if user didn't cancel and we got a valid image
      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0].uri; // Return the image URI
      }

      return null; // User cancelled or no image selected
    } catch (error) {
      console.error("Error taking photo:", error);
      throw error; // Let calling code handle the error
    } finally {
      setLoading(false); // Always clear loading state
    }
  };

  // Function to select an image from the device photo gallery
  const pickFromGallery = async () => {
    try {
      setLoading(true); // Show loading state
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images (no videos)
        allowsEditing: true,    // Allow cropping/editing for better fit
        aspect: [1, 1],        // Square aspect ratio for consistent display
        quality: 0.8,          // Compress to 80% quality
        base64: false,         // Don't need base64 encoding
      });

      console.log("Gallery result:", result);

      // Check if user didn't cancel and we got a valid image
      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0].uri; // Return the image URI
      }

      return null; // User cancelled or no image selected
    } catch (error) {
      console.error("Error picking from gallery:", error);
      throw error; // Let calling code handle the error
    } finally {
      setLoading(false); // Always clear loading state
    }
  };

  // Return the hook's public interface
  return {
    takePhoto,        // Function to take photo with camera
    pickFromGallery,  // Function to select from gallery
    loading,          // Boolean indicating if operation in progress
  };
};
