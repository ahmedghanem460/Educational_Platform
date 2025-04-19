import { View, Text, Platform, ActivityIndicator, TextInput, Pressable, KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/Home/Header'
import NoCourse from '../../components/Home/NoCourse'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig'
import { useRouter } from 'expo-router'
import { addDoc, collection, Timestamp } from 'firebase/firestore'

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [feedbacks, setfeedbacks] = useState('');
  const usermassage = async () => {
    try {
      if (feedbacks) {
        await addDoc(collection(FIREBASE_DB, 'feedbacks'), {
          email: FIREBASE_AUTH.currentUser?.email,
          massage: feedbacks,
          Timestamp: new Date()
        })
        alert('Thanks For Suggestion')
        setfeedbacks('')
      }
      else {
        alert('Please Write a Massage ')
      }
    } catch (error: any) {
      const errormassage = error.massage
      alert('Error signing in: ' + errormassage)
    }

  }

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        setIsAuthenticated(false);
        setLoading(false);
        router.replace('/');
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#ffd33d" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <View style={{ flex: 1, padding: 25, paddingTop: Platform.OS == 'ios' ? 45 : 0, backgroundColor: '#25292e' }}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 0 }} ref={scrollViewRef}>
        <Header />
        <NoCourse />
        <KeyboardAvoidingView>
          <TextInput
            style={styles.input}
            placeholder="Suggestions To Improve The Service"
            value={feedbacks}
            onChangeText={setfeedbacks}
          />
          <Pressable onPress={(usermassage)}><Text style={styles.button}>send</Text></Pressable>
        </KeyboardAvoidingView>
        <Pressable onPress={() => { FIREBASE_AUTH.signOut() }} style={{ padding: 10, borderRadius: 10, alignSelf: 'center' }}>
          <Text style={{ fontSize: 18, color: '#1e90ff', fontFamily: 'outfit' }}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  input: {
    height: 55,
    color: 'black',
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    width: 290,
    margin: 'auto',
    marginTop: -5
  },
  button: {
    padding: 10,
    borderRadius: 10,
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#007bff',
    width: 80,
    margin: 'auto',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10
  }
})
