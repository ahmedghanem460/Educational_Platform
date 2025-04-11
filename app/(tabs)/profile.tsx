import React from 'react';
import { FIREBASE_AUTH } from "../../config/FirebaseConfig";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

const user = {
  name: 'Test',
  email: 'Test@example.com',
  avatar: 'https://i.pravatar.cc/150?img=12',
  courses: [
    { id: '1', title: 'Intro to Computer Science' },
    { id: '2', title: 'Data Structures & Algorithms' },
    { id: '3', title: 'Mobile App Development' },
  ],
};

const Profile = () => {
  const handleEditCourses = () => {
    Alert.alert('Edit Courses', 'This will navigate to the edit courses screen.');
    // You can navigate to a screen or open a modal here
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'You have been logged out.');
    // Add actual logout logic here
  };
  const logout = () => FIREBASE_AUTH.signOut();

  return (
    <View style={styles.container}>
      {/* User Card */}
      <View style={styles.card}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btn} onPress={handleEditCourses}>
              <Text style={styles.btnText}>Edit Courses</Text>
            </TouchableOpacity>

            <TouchableOpacity  style={[styles.btn, styles.logoutBtn]} onPress={logout}>
              <Text style={[styles.btnText, { color: 'red' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
      </View>

      {/* Courses Section */}
      <Text style={styles.sectionTitle}>My Courses</Text>
      <FlatList
        data={user.courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>{item.title}</Text>
          </View>
        )}
        contentContainerStyle={styles.courseList}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f9fc',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'column',
    gap:10,
    marginEnd: 30,
  },
  btn: {
    backgroundColor: '#eef1f4',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutBtn: {
    backgroundColor: '#ffecec',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  courseList: {
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  courseTitle: {
    fontSize: 16,
    color: '#333',
  },
});