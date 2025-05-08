import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/Home/Header'
import NoCourse from '../../components/Home/NoCourse'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig'
import { useRouter } from 'expo-router'
import { addDoc, collection } from 'firebase/firestore'

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [feedbacks, setFeedbacks] = useState('');

  const userMassage = async () => {
    try {
      if (feedbacks.trim()) {
        await addDoc(collection(FIREBASE_DB, 'feedbacks'), {
          email: FIREBASE_AUTH.currentUser?.email,
          message: feedbacks,
          timestamp: new Date()
        });
        alert('Thanks for your suggestion!');
        setFeedbacks('');
        Keyboard.dismiss();
      } else {
        alert('Please write a message');
      }
    } catch (error: any) {
      alert('Error sending message: ' + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
      if (!user) router.replace('/');
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffd33d" />
      </View>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Header />
            <NoCourse />

            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>Have a Suggestion?</Text>
              <TextInput
                style={styles.input}
                placeholder="Suggestions to improve the service"
                placeholderTextColor="#999"
                value={feedbacks}
                onChangeText={setFeedbacks}
                multiline
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
              />
              <Pressable 
                onPress={userMassage}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed
                ]}
              >
                <Text style={styles.buttonText}>Send</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => FIREBASE_AUTH.signOut()}
              style={styles.signOutButton}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  mainContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  feedbackContainer: {
    marginTop: 30,
    backgroundColor: '#2c2c2e',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
    fontFamily: 'outfit',
    textAlign: 'center',
  },
  input: {
    minHeight: 100,
    color: '#fff',
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#3a3a3c',
    textAlignVertical: 'top',
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'outfit',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  signOutButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
  },
  signOutText: {
    fontSize: 16,
    color: '#ff453a',
    fontFamily: 'outfit',
    fontWeight: '600',
  },
});

export default Home;