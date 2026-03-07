import { View, Text, FlatList, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-chart-kit";
import { getCrops } from "../services/api";
import CropCard from "../components/CropCard";

export default function Trader() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getCrops();
    const data = await res.json();
    setCrops(data);
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <LinearGradient
      colors={["#004d40", "#26a69a", "#b2dfdb"]}
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
        Trader Market Feed
      </Text>

      {/* Market Price Graph */}

      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          datasets: [
            {
              data: [2200, 2400, 2300, 2500, 2600],
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix="₹"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: () => `#2e7d32`,
          labelColor: () => `#333`,
        }}
        style={{
          borderRadius: 16,
          marginBottom: 20,
        }}
      />

      <FlatList
        data={crops}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => <CropCard item={item} />}
      />
    </LinearGradient>
  );
}