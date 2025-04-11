import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { TouchableOpacity, Text, Alert, View } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../config/FirebaseConfig'; // adjust if needed

const CustomHeader = ({ title }: { title: string }) => {
  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      Alert.alert('Success', 'You have been logged out.');
    } catch (error) {
      Alert.alert('Error', 'Logout failed.');
      console.error('Logout error:', error);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '1020%',
        paddingHorizontal: 15,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={{ color: '#ff0000', fontSize: 18 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: { backgroundColor: '#25292e' },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#25292e' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
          headerTitle: () => <CustomHeader title="Home" />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
          ),
          headerTitle: () => <CustomHeader title="About" />,
        }}
      />
      <Tabs.Screen
        name="courseListing"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} color={color} size={24} />
          ),
          headerTitle: () => <CustomHeader title="Courses" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ),
          headerTitle: () => <CustomHeader title="Profile" />,
        }}
      />
    </Tabs>
  );
}
