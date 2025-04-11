import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import Button from '../Home/shared/Button'
import { useRouter } from 'expo-router'

const NoCourse = () => {
  const router = useRouter();

  const handleCreateCourse = () => {
    router.push('/(tabs)/create-course');
  }

  const handleExploreCourses = () => {
    router.push('/(tabs)/courseListing');
  }

  return (
    <View style={{flex:1, padding: 20}}>
      
      <View style={{
        // backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%'
      }}>
        <Image 
          source={require('@/assets/images/book.jpg')}
          style={{
            width: 200,
            height: 200,
            marginBottom: 10,
            borderRadius: 10
          }}
        />
        <Text style={{
          fontSize: 24,
          fontFamily: 'outfit-bold',
          // color: 'black',
          textAlign: 'center'
        }}>
          You Don't Have Any Course
        </Text>
      </View>

      <View style={{width: '45%',marginHorizontal: 'auto'}}>
        <Button 
          text='+ Create New Course' 
          onPress={handleCreateCourse}
        />
        <Button 
          text='Explore Existing Courses' 
          type='outline' 
          onPress={handleExploreCourses}
        />
      </View>
    </View>
  )
}

export default NoCourse