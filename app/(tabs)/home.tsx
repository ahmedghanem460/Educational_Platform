import { View, Text, Platform, ActivityIndicator, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/Home/Header'
import NoCourse from '../../components/Home/NoCourse'
import { FIREBASE_AUTH } from '../../config/FirebaseConfig'
import { useRouter } from 'expo-router'

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  // const scrollToTop = () => {
  //     scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  // };

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
    <View style={{flex:1, padding:25, paddingTop:Platform.OS == 'ios' ? 45 : 0, backgroundColor:'#25292e'}}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={{flex:1}} contentContainerStyle={{paddingBottom: 0}} ref={scrollViewRef}>
        <Header/>
        <NoCourse/>
        <Pressable onPress={() => { FIREBASE_AUTH.signOut() }} style={{ padding:10, borderRadius:10, alignSelf:'center' }}>
          <Text style={{fontSize:18, color: '#1e90ff', fontFamily:'outfit'}}>Sign Out</Text>
        </Pressable>
      </ScrollView>
      {/* <Text style={{fontSize:25, fontWeight:'bold'}}>Home</Text> */}
    </View>
  )
}

export default Home