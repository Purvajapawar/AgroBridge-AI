import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { registerUser } from "../services/api";

export default function Register() {

  const router = useRouter();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("");

  const register = async () => {

    if(!name || !email || !password || !role){
      alert("Please fill all fields");
      return;
    }

    try {

      const res = await registerUser({
        name,
        email,
        password,
        role
      });

      const data = await res.json();

      console.log("Register response:", data);

      alert("Registration successful");

      router.push("/login");

    } catch(error) {

      console.log(error);
      alert("Registration failed");

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
textAlign:"center",
marginBottom:30
}}>
🌱 AgroBridge Register
</Text>

<TextInput
placeholder="Name"
value={name}
onChangeText={setName}
style={{
backgroundColor:"white",
padding:15,
borderRadius:10,
marginBottom:15
}}
/>

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
marginBottom:15
}}
/>

<TextInput
placeholder="Role (farmer / trader / mill)"
value={role}
onChangeText={setRole}
style={{
backgroundColor:"white",
padding:15,
borderRadius:10,
marginBottom:20
}}
/>

<TouchableOpacity
onPress={register}
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
Register
</Text>

</TouchableOpacity>

<TouchableOpacity
onPress={()=>router.push("/login")}
style={{marginTop:20}}
>

<Text style={{
textAlign:"center",
color:"white",
fontSize:16
}}>
Already have an account? Login
</Text>

</TouchableOpacity>

</LinearGradient>

  );

}