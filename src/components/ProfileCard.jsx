// src/components/ProfileCard.jsx
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import MyFont from "./forms/MyFont"; // ✅ Import MyFont

const ProfileCard = () => {
  // Dummy data (replace with real later)
  const username = "Emanuel";
  const handle = "@emamirjuno";
  const items = 12;
  const outfits = 5;

  return (
    <View style={styles.card}>
      {/* 👤 Profile Image */}
      <Image
        source={require("../assets-app/images/Profil/emanuel-copy.png")}
        style={styles.profileImage}
      />

      {/* 📝 Info */}
      <View style={styles.infoContainer}>
        <MyFont style={styles.username}>{username}</MyFont>
        <MyFont style={styles.handle}>{handle}</MyFont>

        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <MyFont style={styles.statNumber}>{items}</MyFont>
            <MyFont style={styles.statLabel}>Items</MyFont>
          </View>

          <View style={styles.statBlock}>
            <MyFont style={styles.statNumber}>{outfits}</MyFont>
            <MyFont style={styles.statLabel}>Outfits</MyFont>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignSelf: "stretch",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  handle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  statBlock: {
    alignItems: "center",
    minWidth: 80,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
});
