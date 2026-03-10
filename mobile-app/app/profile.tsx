import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await AsyncStorage.getItem("detections");
    if (data) {
      setHistory(JSON.parse(data));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farmer Profile</Text>

      {history.map((item, index) => (
        <Text key={index} style={styles.item}>
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F0F7F4" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
  item: { marginBottom: 8 },
});