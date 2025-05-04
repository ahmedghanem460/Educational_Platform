import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const AdminDashboard = () => {
  const router = useRouter(); // لتوجيه المستخدم

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <Pressable style={styles.button} onPress={() => router.push('/addCourse')}>
        <Text style={styles.buttonText}>Add Course</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/updateCourse')}>
        <Text style={styles.buttonText}>Update Course</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/deleteCourse')}>
        <Text style={styles.buttonText}>Delete Course</Text>
      </Pressable>
    </View>
  );
};

// الأنماط (styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default AdminDashboard;
