// src/utils/imageUtils.js
import * as ImagePicker from "expo-image-picker";

/**
 * imageUtils.js
 * Handles all logic related to selecting or capturing images from the user's device.
 * Uses Expo's ImagePicker API (since it's simple and well-supported).
 */

/**
 * Opens the image library for the user to select an existing picture.
 * @returns {object|null} selected image or null if cancelled
 */
export const pickImageFromLibrary = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], // square crop
    quality: 0.8,
  });

  if (!result.canceled) {
    return { uri: result.assets[0].uri };
  }
  return null;
};

/**
 * Opens the camera for the user to take a new picture.
 * @returns {object|null} captured image or null if cancelled
 */
export const takePhotoWithCamera = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (permission.status !== "granted") {
    alert("Camera access denied!");
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    return { uri: result.assets[0].uri };
  }
  return null;
};
