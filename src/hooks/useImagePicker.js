// src/hooks/useImagePicker.js
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

/**
 * Custom hook to handle selecting or capturing an image for new clothing items.
 */
export const useImagePicker = () => {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    try {
      if (Platform.OS !== "web") {
        // Request camera permissions
        const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
        console.log("Camera permission:", cameraResult);

        // Request media library permissions
        const mediaResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("Media library permission:", mediaResult);

        return {
          camera: cameraResult.status === "granted",
          mediaLibrary: mediaResult.status === "granted",
        };
      }
      return { camera: true, mediaLibrary: true };
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return { camera: false, mediaLibrary: false };
    }
  };

  const takePhoto = async () => {
    try {
      setLoading(true);
      console.log("Starting takePhoto...");

      const permissions = await requestPermissions();
      if (!permissions.camera) {
        alert("Camera permission is required to take photos.");
        return null;
      }

      console.log("Opening camera...");
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // ← Fixed this line
        allowsEditing: false,
        quality: 0.8,
        base64: false,
      });

      console.log("Camera result:", result);

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

  const pickFromGallery = async () => {
    try {
      setLoading(true);
      console.log("Starting pickFromGallery...");

      const permissions = await requestPermissions();
      if (!permissions.mediaLibrary) {
        alert("Photo library permission is required to select images.");
        return null;
      }

      console.log("Opening gallery...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // ← Fixed this line
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      console.log("Gallery result:", result);

      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("Error picking from gallery:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    takePhoto,
    pickFromGallery,
    loading,
  };
};
