import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function Pricing() {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const predictPrice = async () => {
    const res = await fetch("http://127.0.0.1:5000/predict-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, quantity }),
    });

    const data = await res.json();
    setPrice(data.predictedPrice);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Prediction</Text>

      <TextInput
        placeholder="Product"
        style={styles.input}
        value={product}
        onChangeText={setProduct}
      />

      <TextInput
        placeholder="Quantity (kg)"
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={predictPrice}>
        <Text style={styles.buttonText}>Predict Price</Text>
      </TouchableOpacity>

      {price !== "" && (
        <Text style={styles.result}>
          Estimated Value: ₹ {price}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F0F7F4" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1B4332",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "600" },
  result: { marginTop: 20, fontSize: 18 },
});