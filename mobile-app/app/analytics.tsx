import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Analytics() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics Dashboard</Text>

      <View style={styles.card}>
        <Text>Total Detections: 12</Text>
      </View>

      <View style={styles.card}>
        <Text>Most Detected: Tomato</Text>
      </View>

      <View style={styles.card}>
        <Text>Average Confidence: 84%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F0F7F4" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
  },
});