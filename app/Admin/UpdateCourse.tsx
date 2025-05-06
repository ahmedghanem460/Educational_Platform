import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/FirebaseConfig';

const UpdateCourse = () => {
  const [courseId, setCourseId] = useState('');
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchCourse = async () => {
    if (!courseId.trim()) {
      Alert.alert('Error', 'Please enter a Course ID');
      return;
    }

    try {
      const courseRef = doc(FIREBASE_DB, 'courses', courseId);
      const docSnap = await getDoc(courseRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name);
        setLink(data.link);
        setCategory(data.category);
        setDescription(data.description || '');
        setIsLoaded(true);
        Alert.alert('Loaded', 'Course data loaded successfully');
      } else {
        Alert.alert('Error', 'Course not found');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load course');
    }
  };

  const handleUpdateCourse = async () => {
    if (!name || !link || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const courseRef = doc(FIREBASE_DB, 'courses', courseId);
      await updateDoc(courseRef, {
        name,
        link,
        category,
        description,
        updatedAt: new Date(),
      });
      Alert.alert('Success', 'Course updated successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Course</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Course ID"
        value={courseId}
        onChangeText={setCourseId}
      />

      <Pressable style={styles.loadButton} onPress={fetchCourse}>
        <Text style={styles.buttonText}>Load Course</Text>
      </Pressable>

      {isLoaded && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Course Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Course Link"
            value={link}
            onChangeText={setLink}
          />

          <Text style={styles.label}>Select Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={setCategory}
              style={styles.picker}
            >
              <Picker.Item label="-- Choose Category --" value="" />
              <Picker.Item label="Programming" value="Programming" />
              <Picker.Item label="Mathematics" value="Mathematics" />
              <Picker.Item label="Design" value="Design" />
              <Picker.Item label="Business" value="Business" />
            </Picker>
          </View>

          <Text style={styles.label}>Course Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Write Description"
            value={description}
            onChangeText={setDescription}
          />

          <Pressable style={styles.button} onPress={handleUpdateCourse}>
            <Text style={styles.buttonText}>Update</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15,
  },
  picker: { height: 50, width: '100%' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, marginTop: 10 },
  loadButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, marginBottom: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});

export default UpdateCourse;
