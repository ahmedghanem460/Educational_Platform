import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/FirebaseConfig';

const AddCourse = () => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [description, setdescription] = useState('');

  const handleAddCourse = async () => {
    if (!name || !link || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const courseRef = doc(collection(FIREBASE_DB, 'courses'));
      const courseId = courseRef.id;

      await setDoc(courseRef, {
        courseId,
        name,
        link,
        category,
        description,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Course added successfully');

      setName('');
      setLink('');
      setCategory('');
      setdescription('');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Course</Text>

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
          onValueChange={(itemValue) => setCategory(itemValue)}
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
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Write Description"
        value={description}
        onChangeText={setdescription}
        multiline
      />

      <Pressable style={styles.button} onPress={handleAddCourse}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    marginBottom: 20, 
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20, 
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AddCourse;
