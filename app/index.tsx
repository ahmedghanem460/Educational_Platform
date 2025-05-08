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
  role: string;
  cartItems: any[];
}


export default function Index() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(userDetailsContext);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {
        const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
        getDoc(userDocRef)
          .then((doc) => {
            if (doc.exists()) {
              const userData = doc.data() as UserDetails;
              setUserDetails({
                ...userData,
                role: userData.role || 'user',
                cartItems: userData.cartItems || []
              });
              setIsAuthenticated(true);
              router.replace('/home');
            } else {
              setIsAuthenticated(false);
              setLoading(false);
            }
          })
          .catch((error) => {
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Welcome to Our AI-Powered Educational Platform! 🤖📚
          </Text>
          
          <Text style={styles.subtitle}>
            Unlock your full learning potential with our intelligent and personalized educational experience.
          </Text>

          <View style={styles.featureCard}>
            <FontAwesome name="lightbulb-o" size={28} color="#4A90E2" style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Personalized Learning Paths</Text>
            <Text style={styles.featureText}>
              Our AI analyzes your learning style and progress to curate content tailored just for you.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <FontAwesome name="graduation-cap" size={28} color="#4A90E2" style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Intelligent Tutoring</Text>
            <Text style={styles.featureText}>
              Get instant answers, detailed explanations, and helpful feedback from our AI tutor.
            </Text>
          </View>

          <View style={styles.imageWrapper}>
            <Image 
              source={PlaceholderImage} 
              style={styles.image} 
              contentFit="cover"
            />
          </View>

          <Text style={styles.ctaText}>
            Ready to transform your learning journey? Join us today! ⬇️
          </Text>

          <View style={styles.buttonsContainer}>
            <Pressable 
              onPress={() => router.push('/Register')} 
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => router.push('/Login')}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.secondaryButtonText}>Already have an account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'outfit-bold',
    lineHeight: 32,
  },
  subtitle: {
    color: '#A0A0A0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'outfit',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featureCard: {
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
  },
  featureText: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'outfit',
    lineHeight: 20,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 20,
    width: '100%',
    aspectRatio: 3/4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'outfit-bold',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'outfit-bold',
  },
  secondaryButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'outfit-bold',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});