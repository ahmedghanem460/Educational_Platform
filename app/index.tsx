import React from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/FirebaseConfig';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import userDetailsContext from '../context/UserDetailContext';
import { doc, getDoc } from 'firebase/firestore';

const PlaceholderImage = require('@/assets/images/photo.png');
interface UserDetails {
  name: string;
  email: string;
  password: string;
  uid: string;
}
// const logout = () => FIREBASE_AUTH.signOut();

export default function Index() {
  const router = useRouter();
  const {userDetails, setUserDetails} = useContext(userDetailsContext)
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {
        const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
        getDoc(userDocRef).then((doc) => {
          if (doc.exists()) {
            const userData = doc.data() as UserDetails;
            setUserDetails(userData);
            setIsAuthenticated(true);
            router.replace('/home');
          } else {
            setIsAuthenticated(false);
            setLoading(false);
          }
        }).catch((error) => {
          console.error('Error fetching user details:', error);
          setIsAuthenticated(false);
          setLoading(false);
        });
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }  
  
  return (
    <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0 }}>
          <Text style={[styles.title, { fontFamily: 'outfit-bold' }]}>
              Welcome to Our AI-Powered Educational Platform! 🤖📚
          </Text>
          <Text style={[styles.text, { fontFamily: 'outfit', marginBottom: 20 }]}>
              Unlock your full learning potential with our intelligent and personalized educational experience.
          </Text>
          <View style={styles.feature}>
              <FontAwesome name="lightbulb-o" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.featureTitle, { fontFamily: 'outfit-bold' }]}>Personalized Learning Paths</Text>
              <Text style={[styles.featureDescription, { fontFamily: 'outfit' }]}>
                  Our AI analyzes your learning style and progress to curate content tailored just for you.
              </Text>
          </View>
          <View style={styles.feature}>
              <FontAwesome name="graduation-cap" size={30} color="#fff" style={styles.icon} />
              <Text style={[styles.featureTitle, { fontFamily: 'outfit-bold' }]}>Intelligent Tutoring</Text>
              <Text style={[styles.featureDescription, { fontFamily: 'outfit' }]}>
                  Get instant answers, detailed explanations, and helpful feedback from our AI tutor.
              </Text>
          </View>
          <View style={styles.imageContainer}>
              <Image source={PlaceholderImage} style={styles.image} />
          </View>
          <Text style={[styles.callToAction, { marginTop: 30, fontFamily: 'outfit-bold' }]}>
              Ready to transform your learning journey? Join us today! ⬇️
          </Text>

          <Pressable onPress={() => router.push('/Register')} style={{ marginTop: 12, alignSelf:'center' }}>
            <Text style={styles.link}>Get Started</Text>  
          </Pressable>
          <Pressable onPress={() => router.push('/Login')} style={{ marginTop: 5, alignSelf:'center' }}>
            <Text style={styles.link}>Already have an account</Text>
          </Pressable>
        </ScrollView>
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30, 
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  feature: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  featureTitle: {
    color: 'white',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  image: {
    width: 300, 
    height: 400, 
    borderRadius: 12,
  },
  callToAction: {
    color: 'white',
    fontSize: 18,
    marginTop: 25,
    textAlign: 'center',
  },
  link: {
    color: '#1e90ff',
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'outfit',
  },
  learnMore: {
    color: 'lightblue',
    marginTop: 25,
    fontSize: 16,
  },
  icon: {
    marginBottom: 10,
  },
});