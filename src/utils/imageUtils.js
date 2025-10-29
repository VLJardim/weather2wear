// src/utils/imageUtils.js
import * as ImagePicker from "expo-image-picker";

/**
 * imageUtils.js
 * Handles all logic related to selecting or capturing images from the user's device.
 * Uses Expo's ImagePicker API (since it's simple and well-supported).
 */


export const pickImageFromLibrary = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], 
    quality: 0.8,
  });

  if (!result.canceled) {
    return { uri: result.assets[0].uri };
  }
  return null;
};


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
