import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const courses = [
  { id: '1', title: 'React Native Full Course for Beginners', Channel: 'freeCodeCamp.org', image:require('../../assets/images/react-native.jpg'), url: 'https://youtu.be/sm5Y7Vtuihg?si=AjeOrFnWImxzEfpx' },
  { id: '2', title: 'JavaScript Full Course', Channel: 'Bro Code', image:require('../../assets/images/js.jpg'), url: 'https://youtu.be/lfmg-EJ8gm4?si=yLN87XnqXTIYEq0b' },
  { id: '3', title: 'UI/UX Design in Arabic', Channel: 'Mina Boules', image:require('../../assets/images/uiux.jpg'), url: 'https://youtube.com/playlist?list=PLmQ0KfqeaHAuud_Aav-94nfToArf6Uh4K&si=vJgznQUe-9Y22sVH' },
  { id: '4', title: 'Python in 100 Seconds', Channel: 'Fireship', image:require('../../assets/images/python.jpg'), url: 'https://youtu.be/x7X9w_GIm1s?si=CvHePx9xrzLuOWAI' },
  { id: '5', title: 'Node.js and other topics in Arabic ', Channel: 'أكاديمية ترميز', image:require('../../assets/images/node-js.jpg'), url: 'https://youtu.be/LG7ff9TVWjM?si=JpvZ7cgEUPhH0gjC' },
  { id: '6', title: 'Flutter in Arabic', Channel: 'adham saber', image:require('../../assets/images/flutter.jpg'), url: 'https://youtu.be/D1Go5WAw6Z0?si=wx_YJu3dcMUrtvaD' },
  { id: '7', title: 'DevOps Tutorial for Beginners', Channel: 'edureka!', image:require('../../assets/images/dev-ops.jpg'), url: 'https://youtu.be/hQcFE0RD0cQ?si=chY_oyzG3E2Jh19m' },
  { id: '8', title: 'Data Science Full Course for Beginners', Channel: 'Simplilearn', image:require('../../assets/images/data.jpg'), url: 'https://youtu.be/SJuR41tlE9k?si=LngPVyUbEPQJRX7M' },
  { id: '9', title: 'Machine Learning with Python and Scikit', Channel: 'freeCodeCamp.org', image:require('../../assets/images/machine.jpg'), url: 'https://youtu.be/hDKCxebp88A?si=pg6miE7swjWZrLHz' },
  { id: '10', title: 'Cyber Security for Beginners', Channel: 'Google Career Certificates', image:require('../../assets/images/cyber.jpg'), url: 'https://youtu.be/_DVVNOGYtmU?si=fmurJTjrYB8m5SLN' },
  { id: '11', title: 'Java Full Course for Beginners', Channel: 'Programming with Mosh', image:require('../../assets/images/Java-Logo.jpg'), url: 'https://youtu.be/eIrMbAQSU34?si=F36kShbOHgNek5Kx' },
];

const handleAddToFavorites = (courseId: string) => {
  // Logic to add the course to favorites
  // This could involve updating a state or making an API call
  console.log(`Course with ID ${courseId} added to favorites`);
}

const handleRemoveFromFavorites = (courseId: string) => {
  // Logic to remove the course from favorites
  // This could involve updating a state or making an API call
  console.log(`Course with ID ${courseId} removed from favorites`);
}

const handleAddToWatchLater = (courseId: string) => {
  // Logic to add the course to watch later
  // This could involve updating a state or making an API call
  console.log(`Course with ID ${courseId} added to watch later`);
}

const handleRemoveFromWatchLater = (courseId: string) => {
  // Logic to remove the course from watch later
  // This could involve updating a state or making an API call
  console.log(`Course with ID ${courseId} removed from watch later`);
}

const handleShareCourse = (courseId: string) => {
  // Logic to share the course
  // This could involve using a sharing library or API
  console.log(`Course with ID ${courseId} shared`);
}

const CourseListing = () => {
    const openCourse = (url: string) => {
      Linking.openURL(url);
    };
  
    return (
      <View style={styles.container}>
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => openCourse(item.url)}>
              <Image 
                source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                style={styles.image} 
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.ChannelName}>{item.Channel}</Text>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', fontWeight: '500', marginTop: 20 }}>No courses available</Text>}
          // ListHeaderComponent={<Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Courses</Text>}
          ListFooterComponent={<Text style={{ textAlign: 'center', fontWeight: '500', marginTop: 20 }}>End of courses</Text>}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f9fa',
    },
    card: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 10,
    },
    textContainer: {
      marginLeft: 15,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    ChannelName: {
      fontSize: 14,
      color: 'gray',
    },
  });
  
  export default CourseListing;