// src/components/Layout/ScreenWrapper.js
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

/**
 * Wraps each screen to handle padding, safe area, and background color.
 */
const ScreenWrapper = ({ children, style }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
