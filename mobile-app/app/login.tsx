import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../services/api";

export default function Login() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async () => {

    if(!email || !password){
      alert("Enter email and password");
      return;
    }

    try {

      const res = await loginUser({
        email,
        password
      });

      const data = await res.json();

      console.log("Login response:", data);

      if(data.role === "farmer"){
        router.push("/farmer");
      }

      else if(data.role === "trader"){
        router.push("/trader");
      }

      else if(data.role === "mill"){
        router.push("/mill");
      }

      else{
        alert("Invalid login credentials");
      }

    } catch(error) {

      console.log(error);
      alert("Server error");

    }

  };

  return (

<LinearGradient
colors={["#1b5e20","#43a047","#a5d6a7"]}
style={{flex:1,justifyContent:"center",padding:30}}
>

<Text style={{
fontSize:32,
fontWeight:"700",
color:"white",
marginBottom:30,
textAlign:"center"
}}>
🌾 AgroBridge Login
</Text>

<TextInput
placeholder="Email"
value={email}
onChangeText={setEmail}
style={{
backgroundColor:"white",
padding:15,
borderRadius:10,
marginBottom:15
}}
/>

<TextInput
placeholder="Password"
secureTextEntry
value={password}
onChangeText={setPassword}
style={{
backgroundColor:"white",
padding:15,
borderRadius:10,
marginBottom:20
}}
/>

<TouchableOpacity
onPress={login}
style={{
backgroundColor:"#0d47a1",
padding:15,
borderRadius:10
}}
>

<Text style={{
color:"white",
textAlign:"center",
fontSize:18,
fontWeight:"600"
}}>
Login
</Text>

</TouchableOpacity>

<TouchableOpacity
onPress={()=>router.push("/register")}
style={{marginTop:20}}
>

<Text style={{
textAlign:"center",
color:"white",
fontSize:16
}}>
Don't have an account? Register
</Text>

</TouchableOpacity>

</LinearGradient>

  );

}