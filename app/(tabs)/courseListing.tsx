import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

const courses = [
  {
    id: '1',
    title: 'React Native Full Course',
    Channel: 'freeCodeCamp.org',
    description: 'A complete beginner course on React Native.',
    price: '$25.00',
    image: require('../../assets/images/react-native.jpg'),
    url: 'https://youtu.be/sm5Y7Vtuihg?si=AjeOrFnWImxzEfpx',
  },
  {
    id: '2',
    title: 'JavaScript Full Course',
    Channel: 'Bro Code',
    description: 'Learn JavaScript from scratch in this full guide.',
    price: '$55.00',
    image: require('../../assets/images/js.jpg'),
    url: 'https://youtu.be/lfmg-EJ8gm4?si=yLN87XnqXTIYEq0b',
  },
  {
    id: '3',
    title: 'UI/UX Design in Arabic',
    Channel: 'Mina Boules',
    description: 'Master UI/UX design concepts in Arabic.',
    price: '$125.00',
    image: require('../../assets/images/uiux.jpg'),
    url: 'https://youtube.com/playlist?list=PLmQ0KfqeaHAuud_Aav-94nfToArf6Uh4K&si=vJgznQUe-9Y22sVH',
  },
  {
    id: '4',
    title: 'Python in 100 Seconds',
    Channel: 'Fireship',
    description: 'Understand Python quickly in this short video.',
    price: '$45.50',
    image: require('../../assets/images/python.jpg'),
    url: 'https://youtu.be/x7X9w_GIm1s?si=CvHePx9xrzLuOWAI',
  },
  { 
    id: '5', 
    title: 'Node.js and other topics in Arabic ', 
    Channel: 'أكاديمية ترميز', 
    description: 'Learn Node.js and other topics in Arabic.',
    price: '$35.00',
    image: require('../../assets/images/node-js.jpg'), 
    url: 'https://youtu.be/LG7ff9TVWjM?si=JpvZ7cgEUPhH0gjC' 
  },
  { 
    id: '6', 
    title: 'Flutter in Arabic',
    Channel: 'adham saber', 
    description: 'Learn Flutter in Arabic.',
    price: '$30.00',
    image: require('../../assets/images/flutter.jpg'), 
    url: 'https://youtu.be/D1Go5WAw6Z0?si=wx_YJu3dcMUrtvaD' 
  },
  {
    id: '7', 
    title: 'DevOps Tutorial for Beginners', 
    Channel: 'edureka!', 
    description: 'A complete guide to DevOps for beginners.',
    price: '$40.00',
    image: require('../../assets/images/dev-ops.jpg'), 
    url: 'https://youtu.be/hQcFE0RD0cQ?si=chY_oyzG3E2Jh19m' 
  },
  { 
    id: '8',  
    title: 'Data Science Full Course for Beginners', 
    Channel: 'Simplilearn', 
    description: 'A complete guide to Data Science for beginners.',
    price: '$50.00',
    image: require('../../assets/images/data.jpg'), 
    url: 'https://youtu.be/SJuR41tlE9k?si=LngPVyUbEPQJRX7M' 
  },
  { 
    id: '9',  
    title: 'Machine Learning with Python and Scikit', 
    Channel: 'freeCodeCamp.org', 
    description: 'Learn Machine Learning with Python and Scikit.',
    price: '$60.00',
    image: require('../../assets/images/machine.jpg'), 
    url: 'https://youtu.be/hDKCxebp88A?si=pg6miE7swjWZrLHz' 
  },
  { 
    id: '10', 
    title: 'Cyber Security for Beginners', 
    Channel: 'Google Career Certificates', 
    description: 'A complete guide to Cyber Security for beginners.',
    price: '$70.00',
    image: require('../../assets/images/cyber.jpg'), 
    url: 'https://youtu.be/_DVVNOGYtmU?si=fmurJTjrYB8m5SLN' 
  },
  { 
    id: '11', 
    title: 'Java Full Course for Beginners', 
    Channel: 'Programming with Mosh', 
    description: 'Learn Java from scratch in this full course.',
    price: '$80.00',
    image: require('../../assets/images/Java-Logo.jpg'), 
    url: 'https://youtu.be/eIrMbAQSU34?si=F36kShbOHgNek5Kx' 
  },

];

const handleAddToFavorites = (courseId: string) => {
  console.log(`Course with ID ${courseId} added to favorites`);
};

const handleAddToWatchLater = (courseId: string) => {
  console.log(`Course with ID ${courseId} added to watch later`);
};

const handleBuyCourse = (courseId: string) => {
  console.log(`Course with ID ${courseId} added to cart`);
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
          <TouchableOpacity
            style={styles.card}
            onPress={() => openCourse(item.url)}
          >
            <Image
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.channel}>{item.Channel}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <View style={styles.actions}>
                
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#28a745' }]}
                  onPress={() => handleBuyCourse(item.id)}
                >
                  <Text style={styles.buttonText}>Buy it</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', fontWeight: '500', marginTop: 20 }}>
            No courses available
          </Text>
        }
        ListFooterComponent={
          <Text style={{ textAlign: 'center', fontFamily: 'outfit-bold', marginTop: 20, fontSize: 20 }}>
            End of courses
          </Text>
        }
      />
    </View>
  );
};

export default CourseListing;

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
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  channel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ff6347',
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});