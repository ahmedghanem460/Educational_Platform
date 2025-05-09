import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, Animated, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { FIREBASE_DB } from '../../config/FirebaseConfig';
import { collection, addDoc, getDocs, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string | { uri: string };
  url: string;
  Channel: string;
  status: string;
}

const CourseListing = () => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [search, setSearch] = React.useState('');
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = React.useState<Course[]>([]);
  const { addToCart } = useCart();
  const [userCourses, setUserCourses] = React.useState<string[]>([]); // Store the IDs of the courses the user has already bought
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(FIREBASE_DB, 'courses');
        const querySnapshot = await getDocs(coursesCollection);

        const coursesData: Course[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          
          // Clean up the price string
          const cleanedPrice = typeof data.price === 'string'
            ? data.price.replace(/^\$/, '').trim()
            : data.price;

          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            price: cleanedPrice,
            image: data.image,
            url: data.url,
            Channel: data.Channel,
            status: data.status || 'available',
          };
        });

        const availableCourses = coursesData.filter(course => course.status !== 'bought');
        setCourses(availableCourses);
        setFilteredCourses(availableCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    // Fetch the user's purchased courses
    const fetchUserCourses = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
          const userCartCollectionRef = collection(userDocRef, 'yourCourses');
          const querySnapshot = await getDocs(userCartCollectionRef);

          const purchasedCourseIds = querySnapshot.docs.map(doc => doc.id); // Get the course IDs
          setUserCourses(purchasedCourseIds);
        } catch (error) {
          console.error('Error fetching user cart:', error);
        }
      }
    };

    fetchCourses();
    fetchUserCourses();
  }, [currentUser]);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleAddToCart = async (course: Course) => {
    if (course.status === 'bought') {
      alert('You already purchased this course.');
      return;
    }

    if (!currentUser) {
      alert('You need to be logged in to add courses to cart.');
      return;
    }

    try {
      const courseToAdd = {
        id: course.id,
        name: course.title,
        price: parseFloat(course.price),
        image: course.image,
        Channel: course.Channel,
        quantity: 1,
        userId: currentUser.uid,
      };
      console.log('Course to add:', courseToAdd);

      // Reference to user's cart subcollection
      const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
      const userCartCollectionRef = collection(userDocRef, 'cart');

      // Check if course already exists in cart (prevent duplicate)
      const q = query(userCartCollectionRef, where('id', '==', course.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert('This course is already in your cart.');
        return;
      }

      // Add course to user's cart subcollection
      await addDoc(userCartCollectionRef, courseToAdd);

      // Update local cart context
      addToCart(courseToAdd);

      alert('Course added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('There was an error adding the course to the cart.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for courses..."
        placeholderTextColor="#888"
        autoCapitalize="none"
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
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                {userCourses.includes(item.id) ? (
                  <Text style={styles.boughtLabel}>Bought</Text>
                ) : (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#28a745' }]}
                    activeOpacity={0.8}
                    onPress={() => handleAddToCart(item)}
                    disabled={userCourses.includes(item.id)} // Disable button if course is bought
                  >
                    <Text style={styles.buttonText}>Add to cart</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
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
    backgroundColor: '#121212',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
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
    color: '#FFFFFF',
    marginBottom: 4,
  },
  channel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#A0A0A0',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
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
  boughtLabel: {
    backgroundColor: '#555',
    color: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2E7D32',
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
