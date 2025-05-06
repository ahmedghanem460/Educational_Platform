import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { FIREBASE_DB } from '../../config/FirebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Import Firestore methods

interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string | { uri: string };  // Image can be a string or a URI object
  url: string;
  Channel: string;
}

const CourseListing = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [courses, setCourses] = React.useState<Course[]>([]); // Renamed coursesFromDB to courses
  const [filteredCourses, setFilteredCourses] = React.useState<Course[]>([]);
  const { addToCart } = useCart();

  // Fetch courses from Firestore
  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(FIREBASE_DB, 'courses');
        const querySnapshot = await getDocs(coursesCollection);

        const coursesData: Course[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          price: doc.data().price,
          image: doc.data().image,
          url: doc.data().url,
          Channel: doc.data().Channel,
        }));

        setCourses(coursesData);  // Set the fetched courses to the 'courses' state
        setFilteredCourses(coursesData);  // Set the filtered courses as well
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Handle search functionality
  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  // Handle add to cart action
  const handleAddToCart = async (course: Course) => {
    try {
      // Create the course object to add to the cart collection
      const courseToAdd = {
        id: course.id,
        name: course.title,
        price: course.price,
        image: course.image,
        Channel: course.Channel,
        quantity: 1, // Default quantity to 1, adjust as needed
      };

      // Reference to the "cart" collection in Firestore
      const cartCollectionRef = collection(FIREBASE_DB, 'cart');

      // Add the course to Firestore under the "cart" collection
      await addDoc(cartCollectionRef, courseToAdd);

      // Optionally, update your local cart context or state here
      addToCart(courseToAdd);

      alert('Course added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('There was an error adding the course to the cart.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Listing</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for courses..."
        value={search}
        onChangeText={handleSearch}
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
                  image: item.image || require('../../assets/images/Basha El Balaaaad.jpg'),
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
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#28a745' }]}
                activeOpacity={0.8}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.buttonText}>Add to cart</Text>
              </TouchableOpacity>
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
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    width: '60%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
});
