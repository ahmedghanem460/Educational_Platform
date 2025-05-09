import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState, us } from 'react';
import Button from '../../components/Home/shared/Button';
import { generateTopicsAIModel } from '../../config/AiModel';
import {FIREBASE_DB} from '../../config/FirebaseConfig';
import { addDoc, collection, doc, setDoc, Timestamp } from 'firebase/firestore'; 
import useUserDetails from '../../context/UserDetailContext';

const AddCourse = () => {
  const [courseIdea, setCourseIdea] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(useUserDetails);

  const courseTopicsCollectionRef = collection(FIREBASE_DB, 'courseTopics');
  
  const onGenerateTopic = async () => {
  if (!courseIdea.trim()) {
    Alert.alert('Input Required', 'Please enter a topic to generate a roadmap.');
    return;
  }

  try {
    setLoading(true);
    const res = await generateTopicsAIModel(courseIdea);

    try {
      const parsedJson = JSON.parse(res); 
      if (Array.isArray(parsedJson)) {
        setResult(parsedJson);
        try {
          await addDoc(courseTopicsCollectionRef, {
            userId: userDetails?.uid || 'defaultUid',
            courseIdea,
            generatedTopics: parsedJson,
            createdAt: Timestamp.now(),
            userName: userDetails?.name || 'defaultUserName',
          });
          console.log('Saved successfully!');
        } catch (dbError) {
          console.error('Failed to save to Firestore:', dbError);
          Alert.alert('Firestore Error', 'Could not save the topics to Firestore.');
        }
        
        
      } else {
        throw new Error('AI did not return an array.');
      }
    } catch (jsonError) {
      console.warn('Failed to parse JSON response from AI:', jsonError);
      console.warn('Raw AI response was:', res);
      setResult([res]); 
      Alert.alert(
        'Response Format Error',
        'The AI response was not in the expected array format. Displaying raw response.'
      );
    }
  } catch (err) {
      console.error('Error in onGenerateTopic:', err);
      Alert.alert(
        'Generation Failed',
        `Failed to generate roadmap. ${err.message || 'Please try again.'}`
      );
  } finally {
      setLoading(false);
  }
};

  const onClear = () => {
    setCourseIdea('');
    setResult([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Generate Course Topics</Text>
      <Text style={styles.subtitle}>What do you want to learn today?</Text>
      <Text style={styles.label}>
        What course do you want to learn (ex. Learn Python, Digital Marketing, 10th Science Chapters, etc...)
      </Text>

      <TextInput
        placeholder="(Ex. Learn Python, Learn 12th Chemistry)"
        placeholderTextColor="#999"
        style={styles.input}
        multiline
        numberOfLines={4}
        value={courseIdea}
        onChangeText={setCourseIdea}
        textAlignVertical="top"
      />

      <Button text="Generate Topics" type="outline" onPress={onGenerateTopic} loading={loading} />

      {loading && <ActivityIndicator size="large" color="#FFA33D" style={styles.loader} />}

      {result.length > 0 && (
        <>
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Generated Topics:</Text>
            {result.map((item, index) => (
              <Text key={index} style={styles.bulletItem}>
                • {item}
              </Text>
            ))}
          </View>
          <Button text="Clear" type="fill" onPress={onClear} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#25292e',
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 25,
    fontFamily: 'outfit',
    color: '#fff',
    marginTop: 10,
  },
  label: {
    fontSize: 20,
    fontFamily: 'outfit',
    color: '#f2f2f2',
    marginTop: 10,
  },
  input: {
    color: 'black',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    padding: 15,
    fontSize: 18,
    fontFamily: 'outfit',
    marginTop: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
  },
  resultLabel: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: '#ffa33d',
    marginBottom: 10,
  },
  bulletItem: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: '#fff',
    marginBottom: 5,
  },
  loader: {
    marginTop: 20,
  },
});

export default AddCourse;

