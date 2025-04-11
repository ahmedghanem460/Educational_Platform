// import { Tabs } from 'expo-router';

// import Ionicons from '@expo/vector-icons/Ionicons';

// export default function TabLayout() {
//   return (

//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: '#ffd33d',
//         headerStyle: {
//           backgroundColor: '#25292e',
//         },
//         headerShadowVisible: false,
//         headerTintColor: '#fff',
//         tabBarStyle: {
//         backgroundColor: '#25292e',
//         },
//       }}
//     >

//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
//             <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="about"
//         options={{
//           title: 'About',
//           tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
//             <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="CourseListing"
//         options={{
//           title: 'Courses',
//           tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
//             <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { SplashScreen } from "expo-router";
import React from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    outfit: require("@/assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("@/assets/fonts/Outfit-Bold.ttf"),
    "outfit-medium": require("@/assets/fonts/Outfit-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ffa33d" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
