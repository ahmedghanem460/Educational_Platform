import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { FIREBASE_DB } from '../../config/FirebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import UserDetailsContext from '../../context/UserDetailContext';

interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string | { uri: string } | null;
  url: string;
  Channel: string;
}


const CourseListing = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = React.useState<Course[]>([]);
  const { addToCart } = useCart();

  const currentUser = getAuth().currentUser;

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
          image: doc.data().image ?? null,
          url: doc.data().url,
          Channel: doc.data().Channel,
        }));

        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleAddToCart = async (course: Course) => {
    if (!currentUser) {
      alert('You must be logged in to add items to your cart.');
      return;
    }
  
    try {
      const courseToAdd = {
        id: course.id,
        userId: currentUser.uid,
        name: course.title,
        price: parseFloat(course.price),  // Ensure price is a number
        image: course.image,
        Channel: course.Channel,
        quantity: 1,  // quantity will be added in CartContext logic
      };
  
      const userCartRef = collection(FIREBASE_DB, 'users', currentUser.uid, 'cart');
      await addDoc(userCartRef, courseToAdd);
  
      // Now add the course to the context's cart
      addToCart(courseToAdd);
  
      alert('Course added to your cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('There was an error adding the course to the cart.');
    }
  };
  
 

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Course Listing</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for courses..."
        placeholderTextColor="#9E9E9E"
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
                  image: item.image as string,
                  url: item.url,
                  channel: item.Channel,
                },
              })
            }
          >
            <Image
              source={
                item.image
                  ? (typeof item.image === 'string'
                      ? { uri: item.image }
                      : item.image)
                  : require('../../assets/images/Basha El Balaaaad.jpg')
              }
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.channel}>{item.Channel}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
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
    padding: 16,
    backgroundColor: '#121212', // Dark background
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E', // Dark card background
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 4,
  },
  channel: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#A0A0A0', // Gray
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50', // Green
    marginBottom: 12,
  },
  searchBar: {
    height: 48,
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2E7D32', // Dark green
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  resultsText: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 16,
    textAlign: 'center',
  },
});