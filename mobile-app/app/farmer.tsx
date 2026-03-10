import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { addCrop } from "../services/api";

export default function Farmer() {

  const [crop,setCrop] = useState("")
  const [quality,setQuality] = useState("")
  const [price,setPrice] = useState("")

  const predicted = price ? Math.round(Number(price) * 1.1) : 0

  const submit = async () => {

    await addCrop({
      farmer:"Farmer",
      crop,
      quality,
      price:Number(price),
      predicted
    })

    alert("Crop posted to market")

  }

  return(

<LinearGradient
colors={["#1b5e20","#43a047","#a5d6a7"]}
style={{flex:1,padding:25}}
>

<Text style={{
fontSize:30,
fontWeight:"700",
color:"white",
marginBottom:20
}}>
🌾 Farmer Dashboard
</Text>

{/* STATS CARDS */}

<View style={{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:20
}}>

<View style={{
backgroundColor:"#ffffff",
padding:15,
borderRadius:14,
width:"30%",
alignItems:"center"
}}>
<Text style={{fontSize:12,color:"#777"}}>Crops</Text>
<Text style={{fontSize:18,fontWeight:"700"}}>12</Text>
</View>

<View style={{
backgroundColor:"#ffffff",
padding:15,
borderRadius:14,
width:"30%",
alignItems:"center"
}}>
<Text style={{fontSize:12,color:"#777"}}>AI Price</Text>
<Text style={{fontSize:18,fontWeight:"700",color:"#2e7d32"}}>
₹ {predicted}
</Text>
</View>

<View style={{
backgroundColor:"#ffffff",
padding:15,
borderRadius:14,
width:"30%",
alignItems:"center"
}}>
<Text style={{fontSize:12,color:"#777"}}>Trend</Text>
<Text style={{fontSize:18,fontWeight:"700",color:"#1e88e5"}}>
↑ 5%
</Text>
</View>

</View>

{/* INPUT CARD */}

<View style={{
backgroundColor:"white",
padding:20,
borderRadius:16,
marginBottom:20
}}>

<Text style={{
fontSize:18,
fontWeight:"600",
marginBottom:10
}}>
Enter Crop Details
</Text>

<TextInput
placeholder="Crop (Wheat/Tomato/Potato)"
onChangeText={setCrop}
style={{
borderBottomWidth:1,
padding:10,
marginBottom:10
}}
/>

<TextInput
placeholder="Quality Grade (A/B/C)"
onChangeText={setQuality}
style={{
borderBottomWidth:1,
padding:10,
marginBottom:10
}}
/>

<TextInput
placeholder="Price per Quintal"
onChangeText={setPrice}
keyboardType="numeric"
style={{
borderBottomWidth:1,
padding:10
}}
/>

</View>

{/* AI PRICE CARD */}

<View style={{
backgroundColor:"#e8f5e9",
padding:20,
borderRadius:16,
marginBottom:20
}}>

<Text style={{fontSize:18,fontWeight:"600"}}>
AI Price Prediction
</Text>

<Text style={{
fontSize:26,
fontWeight:"700",
color:"#2e7d32",
marginTop:10
}}>
₹ {predicted}
</Text>

</View>

{/* POST BUTTON */}

<TouchableOpacity
onPress={submit}
style={{
backgroundColor:"#0d47a1",
padding:16,
borderRadius:14
}}
>

<Text style={{
color:"white",
textAlign:"center",
fontSize:18,
fontWeight:"600"
}}>
Post Crop to Market
</Text>

</TouchableOpacity>

</LinearGradient>

  )

}