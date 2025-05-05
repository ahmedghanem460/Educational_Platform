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

      <Pressable style={styles.deleteButton} onPress={handleDeleteCourse}>
        <Text style={styles.buttonText}>Delete Course</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 5,
  },
  deleteButton: { backgroundColor: '#dc3545', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});

export default DeleteCourse;
