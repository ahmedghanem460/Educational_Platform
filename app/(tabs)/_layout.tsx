import { Tabs, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TouchableOpacity, Text, Alert, View } from "react-native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../config/FirebaseConfig";
import { useCart } from "../../context/CartContext";
import { UserDetailsProvider } from '../../context/UserDetailContext';

// CustomHeader Component
const CustomHeader = ({
  title,
  cartCount = 0,
  goToCart,
  handleLogout,
}: {
  title: string;
  cartCount: number;
  goToCart: () => void;
  handleLogout: () => void;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        
        width: "200%",
        paddingHorizontal: 10,
      }}
    >
      <Text style={{  color: "#fff", fontSize: 20, fontFamily: "outfit-bold" }}>
        {title}
      </Text>

      <View style={{  flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={goToCart} style={{ marginRight: 15 }}>
          <View>
            <Ionicons name="cart-outline" size={24} color="#ffd33d" />
            {cartCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  right: -6,
                  top: -6,
                  backgroundColor: "red",
                  borderRadius: 10,
                  width: 16,
                  height: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {cartCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: "#ff0000", fontSize: 18 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function TabLayout() {
  const router = useRouter();
  const { cartItems } = useCart();

  const goToCart = () => {
    router.push("/cart");
  };

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      Alert.alert("Success", "You have been logged out.");
    } catch (error) {
      Alert.alert("Error", "Logout failed.");
      console.error("Logout error:", error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: { backgroundColor: "#25292e" },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: { backgroundColor: "#25292e" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
          headerTitle: () => (
            <CustomHeader
              title="Home"
              cartCount={cartItems.length}
              goToCart={goToCart}
              handleLogout={handleLogout}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              color={color}
              size={24}
            />
          ),
          headerTitle: () => (
            <CustomHeader
              title="About"
              cartCount={cartItems.length}
              goToCart={goToCart}
              handleLogout={handleLogout}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="courseListing"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              color={color}
              size={24}
            />
          ),
          headerTitle: () => (
            <CustomHeader
              title="Courses"
              cartCount={cartItems.length}
              goToCart={goToCart}
              handleLogout={handleLogout}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
            />
          ),
          headerTitle: () => (
            <CustomHeader
              title="Profile"
              cartCount={cartItems.length}
              goToCart={goToCart}
              handleLogout={handleLogout}
            />
          ),
        }}
      />
    </Tabs>
  );
}
