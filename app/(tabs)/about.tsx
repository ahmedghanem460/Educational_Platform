import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FIREBASE_AUTH } from "../../config/FirebaseConfig";
import React from "react";

const teamMembers = [
  { name: "Ahmed Mohamed", id: "2227009", email: "ahmedmohamedghanem083@gmail.com" },
  { name: "Kareem Abdullah", id: "2227252", email: "bambokareem72@gmail.com" },
  { name: "Yousef Hesham", id: "2227049", email: "youseefhisham9@gmail.com" },
  { name: "Ziad Ahmed", id: "2227298", email: "Ziada9703@gmail.com" },
  { name: "Amr Ahmed", id: "2227009", email: "amrahmed757574@gmail.com" },
  { name: "Ahmed Aymen", id: "2227295", email: "ahmedaymanmido307@gmail.com" },
  { name: "Kareem Waheed", id: "2127238", email: "karimwaheed263@gmail.com" },
  { name: "Mohamed Yasser", id: "2227283", email: "mohamedyasserelhwary813@gmail.com" },
];

// const logout = () => FIREBASE_AUTH.signOut();

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👥 Our Team</Text>
      {teamMembers.map((member, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.info}>🎓 ID: {member.id}</Text>
            <Text style={styles.info}>📧 {member.email}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#25292e',
      paddingHorizontal: 20, 
  },
  title: {
      fontSize: 26,
      fontFamily: "outfit-bold",
      color: "#ffd33d",
      textAlign: "center",
      marginBottom: 24,
  },
  card: {
      flexDirection: "row",
      backgroundColor: "#999999",
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      alignItems: "center",
      shadowColor: " #111111",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 5,
  },
  avatar: {
      backgroundColor: "#ffd33d",
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
  },
  avatarText: {
      fontFamily: "outfit-bold",
      color: "#fff",
      fontSize: 18,
  },
  details: {
      flex: 1, 
  },
  name: {
      fontSize: 18,
      fontFamily: "outfit-medium",
      color: "#ffffff",
      marginBottom: 4,
  },
  info: {
      color: "#fff",
      fontSize: 14,
  },
});