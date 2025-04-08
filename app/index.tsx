import React from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native';
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
      <Text style={[styles.text, { fontFamily: 'outfit'}]}>
        We are a team of passionate developers working on this exciting project.
        Our goal is to create an app about Educational Platform with AI 🤖📚.
      </Text>

      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image} />
      </View>

      {/* <Text style={styles.text}>
        You should know that we will do all we have to improve you to be able to take full marks.
      </Text> */}

      <Text style={[styles.text, {marginTop:15, fontFamily:'outfit-bold'}]}>You can join us now using the direct links below ⬇️</Text>

      <Pressable onPress={() => router.push('/Register')} style={{ marginTop: 12 }}>
        <Text style={styles.link}>Get Started</Text>
      </Pressable>
      
      <Pressable onPress={() => router.push('/Login')} style={{ marginTop: 10 }}>
        <Text style={styles.link}>Already have an account</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, 
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10, 
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10, 
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  link: {
    color: '#1e90ff',
    marginTop: 20,
  },
});