import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/FirebaseConfig';

const DeleteCourse = () => {
  const [courseId, setCourseId] = useState('');

  const handleDeleteCourse = async () => {
    if (!courseId.trim()) {
      Alert.alert('Error', 'Please enter a Course ID');
      return;
    }

    try {
      const courseRef = doc(FIREBASE_DB, 'courses', courseId);
      await deleteDoc(courseRef);
      Alert.alert('Success', 'Course deleted successfully!');
      setCourseId('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete course');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Delete Course</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Course ID"
        value={courseId}
        onChangeText={setCourseId}
      />

      <Pressable style={styles.button} onPress={handleDeleteCourse}>
        <Text style={styles.buttonText}>Delete Course</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0fa',
    paddingHorizontal: 25,
    paddingTop: 60,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1E90FF',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeleteCourse;
