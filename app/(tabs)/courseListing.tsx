import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

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
    title: 'Python in 100 Seconds',
    Channel: 'Fireship',
    description: 'Understand Python quickly in this short video.',
    price: '$45.50',
    image: require('../../assets/images/python.jpg'),
    url: 'https://youtu.be/x7X9w_GIm1s?si=CvHePx9xrzLuOWAI',
  },
  { 
    id: '4', 
    title: 'Node.js and other topics in Arabic ', 
    Channel: 'أكاديمية ترميز', 
    description: 'Learn Node.js and other topics in Arabic.',
    price: '$35.00',
    image: require('../../assets/images/node-js.jpg'), 
    url: 'https://youtu.be/LG7ff9TVWjM?si=JpvZ7cgEUPhH0gjC' 
  },
  { 
    id: '5', 
    title: 'Flutter in Arabic',
    Channel: 'adham saber', 
    description: 'Learn Flutter in Arabic.',
    price: '$30.00',
    image: require('../../assets/images/flutter.jpg'), 
    url: 'https://youtu.be/D1Go5WAw6Z0?si=wx_YJu3dcMUrtvaD' 
  },
  {
    id: '6', 
    title: 'DevOps Tutorial for Beginners', 
    Channel: 'edureka!', 
    description: 'A complete guide to DevOps for beginners.',
    price: '$40.00',
    image: require('../../assets/images/dev-ops.jpg'), 
    url: 'https://youtu.be/hQcFE0RD0cQ?si=chY_oyzG3E2Jh19m' 
  },
  { 
    id: '7',  
    title: 'Data Science Full Course for Beginners', 
    Channel: 'Simplilearn', 
    description: 'A complete guide to Data Science for beginners.',
    price: '$50.00',
    image: require('../../assets/images/data.jpg'), 
    url: 'https://youtu.be/SJuR41tlE9k?si=LngPVyUbEPQJRX7M' 
  },
  { 
    id: '8',  
    title: 'Machine Learning with Python and Scikit', 
    Channel: 'freeCodeCamp.org', 
    description: 'Learn Machine Learning with Python and Scikit.',
    price: '$60.00',
    image: require('../../assets/images/machine.jpg'), 
    url: 'https://youtu.be/hDKCxebp88A?si=pg6miE7swjWZrLHz' 
  },
  { 
    id: '9', 
    title: 'Cyber Security for Beginners', 
    Channel: 'Google Career Certificates', 
    description: 'A complete guide to Cyber Security for beginners.',
    price: '$70.00',
    image: require('../../assets/images/cyber.jpg'), 
    url: 'https://youtu.be/_DVVNOGYtmU?si=fmurJTjrYB8m5SLN' 
  },
  { 
    id: '10', 
    title: 'Java Full Course for Beginners', 
    Channel: 'Programming with Mosh', 
    description: 'Learn Java from scratch in this full course.',
    price: '$80.00',
    image: require('../../assets/images/Java-Logo.jpg'), 
    url: 'https://youtu.be/eIrMbAQSU34?si=F36kShbOHgNek5Kx' 
  },
];

const CourseListing = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [filteredCourses, setFilteredCourses] = React.useState(courses);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Listing</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for courses..."
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          const filtered = courses.filter((course) =>
            course.title.toLowerCase().includes(text.toLowerCase())
          );
          setFilteredCourses(filtered);
        }}
      />
      <Text style={styles.resultsText}>
        {filteredCourses.length} results found
      </Text>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/courseDetails',
                params: {
                  title: item.title,
                  description: item.description,
                  price: item.price,
                  image: item.image, 
                  url: item.url,
                  channel: item.Channel,
                },
              })
            }
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
            </View>
          </TouchableOpacity>
        )}
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
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  resultsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
});
