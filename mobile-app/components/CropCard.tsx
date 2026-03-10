import { View, Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface CropItem {
  crop: string;
  quality: string;
  price: number;
  predicted: number;
}

export default function CropCard({ item }: { item: CropItem }) {
  return (
    <Animated.View
      entering={FadeInUp.duration(500)}
      style={{
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.crop}</Text>

      <Text style={{ marginTop: 5 }}>Quality: {item.quality}</Text>

      <Text style={{ marginTop: 5 }}>Farmer Price: ₹{item.price}</Text>

      <Text style={{ marginTop: 5, color: "#2e7d32", fontWeight: "700" }}>
        AI Predicted Price: ₹{item.predicted}
      </Text>
    </Animated.View>
  );
}