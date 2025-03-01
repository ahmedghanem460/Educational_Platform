import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const courses = [
  { id: '1', title: 'React Native للمبتدئين', instructor: 'Codezilla', image:require('../assets/images/react-native.jpg'), url: 'https://reactnative.dev/' },
  { id: '2', title: 'كورس متقدم في JavaScript', instructor: 'Bro Code', image:require('../assets/images/js.jpg'), url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { id: '3', title: 'UI/UX تصميم واجهات المستخدم', instructor: 'El Zero',image:require('../assets/images/uiux.jpg'), url: 'https://www.behance.net/' },
  { id: '4', title: 'Python من الصفر للاحتراف', instructor: 'Traversy Media',image:require('../assets/images/python.jpg'), url: 'https://www.python.org/' },
  { id: '5', title: 'Node.js وبرمجة السيرفرات', instructor: 'Academind', image:require('../assets/images/node-js.jpg'), url: 'https://nodejs.org/' },
  { id: '6', title: 'Flutter تطوير تطبيقات الموبايل', instructor: 'Maximilian Schwarzmüller', image:require('../assets/images/flutter.jpg'), url: 'https://flutter.dev/' },
  { id: '7', title: 'DevOps وأساسيات CI/CD', instructor: 'The Net Ninja',image:require('../assets/images/dev-ops.jpg'), url: 'https://aws.amazon.com/devops/' },
  { id: '8', title: 'Data Science وتحليل البيانات', instructor: 'Simplilearn',image:require('../assets/images/data.jpg'), url: 'https://www.kaggle.com/' },
  { id: '9', title: 'Machine Learning الذكاء الاصطناعي', instructor: 'Andrew Ng',image:require('../assets/images/machine.jpg'), url: 'https://www.coursera.org/learn/machine-learning' },
  { id: '10', title: 'Cyber Security الأمن السيبراني', instructor: 'HackerSploit',image:require('../assets/images/cyber.jpg'), url: 'https://www.cybrary.it/' }
];

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
                <Text style={styles.instructor}>{item.instructor}</Text>
              </View>
            </TouchableOpacity>
          )}
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
    instructor: {
      fontSize: 14,
      color: 'gray',
    },
  });
  
  export default CourseListing;