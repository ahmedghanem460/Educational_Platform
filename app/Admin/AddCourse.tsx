import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { collection, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/FirebaseConfig';

const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [channel, setChannel] = useState('');

  const handleAddCourse = async () => {
    if (!title || !url || !price || !image) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const courseRef = doc(collection(FIREBASE_DB, 'courses'));
      const courseId = courseRef.id;

      await setDoc(courseRef, {
        courseId,
        title,
        url,
        price,
        description,
        image,
        Channel: channel || 'Unknown Channel',
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Course added successfully');

      setTitle('');
      setUrl('');
      setPrice('');
      setDescription('');
      setImage('');
      setChannel('');
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
        placeholder="Course Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Course URL"
        placeholderTextColor="#888"
        value={url}
        onChangeText={setUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Course Price"
        placeholderTextColor="#888"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Course Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        placeholderTextColor="#888"
        value={image}
        onChangeText={setImage}
      />
      <TextInput
        style={styles.input}
        placeholder="Channel Name"
        placeholderTextColor="#888"
        value={channel}
        onChangeText={setChannel}
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
    marginTop: 25,
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

export default AddCourse;
