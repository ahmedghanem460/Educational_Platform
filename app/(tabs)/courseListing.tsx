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
  // Add more courses here if needed
];

const handleAddToFavorites = (courseId: string) => {
  console.log(`Course with ID ${courseId} added to favorites`);
};

const handleAddToWatchLater = (courseId: string) => {
  console.log(`Course with ID ${courseId} added to watch later`);
};

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
                  onPress={() => handleAddToWatchLater(item.id)}
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
          <Text style={{ textAlign: 'center', fontWeight: '500', marginTop: 20 }}>
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
