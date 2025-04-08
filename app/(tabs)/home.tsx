import { View, Text, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Home/Header'
import NoCourse from '../../components/Home/NoCourse'
import { FIREBASE_AUTH } from '../../config/FirebaseConfig'
import { useRouter } from 'expo-router'

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff'}}>
        <ActivityIndicator size="large" color="#ffd33d" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <View style={{flex:1, padding:25, paddingTop:Platform.OS == 'ios' ? 45 : 0, backgroundColor:'#fff'}}>
      <Header/>
      <NoCourse/>
      {/* <Text style={{fontSize:25, fontWeight:'bold'}}>Home</Text> */}
    </View>
  )
}

export default Home