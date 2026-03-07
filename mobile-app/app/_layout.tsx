import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {

  return (

<Tabs
screenOptions={{
headerShown:false,
tabBarActiveTintColor:"#2e7d32",
tabBarStyle:{
height:60,
paddingBottom:5
}
}}
>

<Tabs.Screen
name="farmer"
options={{
title:"Dashboard",
tabBarIcon:({color,size}) => (
<Ionicons name="leaf" size={size} color={color}/>
)
}}
/>

<Tabs.Screen
name="trader"
options={{
title:"Market",
tabBarIcon:({color,size}) => (
<Ionicons name="stats-chart" size={size} color={color}/>
)
}}
/>

<Tabs.Screen
name="mill"
options={{
title:"Procurement",
tabBarIcon:({color,size}) => (
<Ionicons name="business" size={size} color={color}/>
)
}}
/>

</Tabs>

  );

}