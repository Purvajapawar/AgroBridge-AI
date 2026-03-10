import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CropCard from "../components/CropCard";
import { getCrops } from "../services/api";

export default function Mill() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getCrops();
    const data = await res.json();
    setCrops(data);
  };

  return (
    <LinearGradient
      colors={["#1a237e", "#3949ab", "#9fa8da"]}
      style={{ flex: 1, padding: 20 }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          color: "white",
          marginBottom: 20,
        }}
      >
        Mill Procurement Dashboard
      </Text>

      <FlatList
        data={crops}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => <CropCard item={item} />}
      />
    </LinearGradient>
  );
}