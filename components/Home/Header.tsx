import { View, Text, Platform, Pressable } from 'react-native'
import React, { useContext } from 'react'
import  UserDetailsContext  from '../../context/UserDetailContext'
import Ionicons from '@expo/vector-icons/Ionicons'

const Header = () => {
  const {userDetails, setUserDetails} = useContext(UserDetailsContext)
  return (
    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', backgroundColor:'#fff', paddingTop:20}}>
      <View style={{ padding: 20, paddingTop: Platform.OS === 'ios' ? 45 : 0 }}>
        <Text style={{fontFamily:'outfit-bold', fontSize:25}}> Hello, {userDetails?.name}</Text>
        <Text style={{fontFamily:'outfit-bold', fontSize:17}}>Let's Get Started</Text>
      </View>
      <Pressable>
        <Ionicons name='settings-outline' size={24} color='black' style={{position:'absolute', right:20, top:10}}/>
      </Pressable>
    </View>
  )
}

export default Header