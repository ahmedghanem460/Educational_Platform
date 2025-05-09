import { View, Text, Platform, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import UserDetailsContext from '../../context/UserDetailContext'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useFocusEffect } from 'expo-router';

const Header = () => {
  const { userDetails } = useContext(UserDetailsContext);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        setUser(currentUser);
        try {
          const userRef = doc(FIREBASE_DB, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          
      } else {
        setLoading(false);
      }
    };
  
    useFocusEffect(
      React.useCallback(() => {
        fetchUserData();
      }, [])
    );

  return (
    <View
      style={{
        paddingTop: Platform.OS === 'ios' ? 20 : 25,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 25,
            color: 'white',
          }}
        >
          Hello, {userDetails?.name}
        </Text>
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 17,
            color: 'white',
          }}
        >
          Let's Get Started
        </Text>
      </View>

      <Pressable style={{ paddingRight: 10 }}>
        <Ionicons name="settings-outline" size={24} color="white" />
      </Pressable>
    </View>
  );
};

export default Header;
