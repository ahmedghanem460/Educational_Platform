import { View, Text, Platform, Pressable } from 'react-native'
import React, { useContext } from 'react'
import UserDetailsContext from '../../context/UserDetailContext'
import Ionicons from '@expo/vector-icons/Ionicons'

const Header = () => {
  const { userDetails } = useContext(UserDetailsContext);
  

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
