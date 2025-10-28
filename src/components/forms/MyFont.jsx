// src/components/forms/MyFont.jsx
import React from "react";
import { Text as RNText, StyleSheet } from "react-native";

export default function MyFont({ children, style, ...props }) {
  return (
    <RNText style={[styles.defaultText, style]} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: "Lato-400Regular", // 👈 must match App.js font key exactly
    color: "#000",
  },
});
