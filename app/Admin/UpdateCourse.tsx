import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/FirebaseConfig';

const UpdateCourse = () => {
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [channel, setChannel] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'You need to grant permission to access gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const fetchCourse = async () => {
    if (!courseId.trim()) {
      Alert.alert('Error', 'Please enter a course ID');
      return;
    }

    try {
      const courseRef = doc(FIREBASE_DB, 'courses', courseId);
      const docSnap = await getDoc(courseRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || '');
        setUrl(data.url || '');
        setPrice(data.price || '');
        setDescription(data.description || '');
        setChannel(data.channel || '');
        setImage(data.image || '');
        setIsLoaded(true);
        Alert.alert('Loaded', 'Course loaded successfully');
      } else {
        Alert.alert('Not Found', 'Course not found with this ID');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong while fetching course');
    }
  };

  const handleUpdateCourse = async () => {
    if (!title || !url || !price || !image) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const courseRef = doc(FIREBASE_DB, 'courses', courseId);
      await updateDoc(courseRef, {
        title,
        url,
        price,
        description,
        image,
        Channel: channel || 'Unknown Channel',
        updatedAt: new Date(),
      });

      Alert.alert('Success', 'Course updated successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while updating');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Update Course</Text>

      <TextInput
        placeholder="Enter Course ID"
        style={styles.input}
        value={courseId}
        onChangeText={setCourseId}
      />

      <Pressable style={styles.loadButton} onPress={fetchCourse}>
        <Text style={styles.buttonText}>Load Course</Text>
      </Pressable>

      {isLoaded && (
        <>
          <TextInput
            placeholder="Course Name"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
                  style={styles.input}
                  placeholder="Course URL"
                  value={url}
                  onChangeText={setUrl}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Course Price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Course Description"
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

          <Pressable style={styles.updateButton} onPress={handleUpdateCourse}>
            <Text style={styles.buttonText}>Update Course</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
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
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  loadButton: {
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
  updateButton: {
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


export default UpdateCourse;
