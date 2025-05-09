import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
  Alert,
  ImageSourcePropType,
  ImageURISource
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/FirebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';

const CourseDetail = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const title = params.title as string;
  const description = params.description as string;
  const price = params.price as string;
  const channel = params.channel as string;
  const url = params.url as string;
  
  const getImageSource = (): ImageSourcePropType => {
    if (typeof params.image === 'string') {
      return { uri: params.image };
    }
    return params.image as ImageSourcePropType;
  };

  const imageSource = getImageSource();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isBought, setIsBought] = useState(false);

  const user = FIREBASE_AUTH.currentUser;
  
  useEffect(() => {
    const checkCourseStatus = async () => {
      if (user && title) {
        setLoadingStatus(true);
        const courseRef = doc(FIREBASE_DB, 'users', user.uid, 'courses', title);
        try {
          const docSnap = await getDoc(courseRef);
          if (docSnap.exists()) {
            setIsBought(true);
          }
        } catch (error) {
          console.error("Error checking course status:", error);
        } finally {
          setLoadingStatus(false);
        }
      } else {
        setLoadingStatus(false);
      }
    };
    checkCourseStatus();
  }, [user, title]);

  const handleBuyPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleBuyPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const executePurchase = async () => {
    if (user && title) {
      try {
        const imageToSave = typeof params.image === 'string'
          ? params.image
          : (params.image as ImageURISource)?.uri || 'default_image_url_if_not_string';

        await setDoc(
          doc(FIREBASE_DB, 'users', user.uid, 'courses', title),
          {
            title,
            description,
            price,
            image: imageToSave,
            channel,
            url
          },
          { merge: true }
        );
        setIsBought(true);
        Alert.alert('Success', 'Course purchased successfully!', [
          { text: 'Watch Now', onPress: () => handleWatch() },
          { text: 'OK', style: 'cancel' }
        ]);
      } catch (error) {
        console.error("Error buying course: ", error);
        Alert.alert('Error', 'Could not purchase the course. Please try again.');
      }
    } else if (!user) {
      Alert.alert('Login Required', 'You need to be logged in to purchase a course.');
    } else {
      Alert.alert('Error', 'Course information is missing.');
    }
  };

  const handleWatch = () => {
    if (isBought) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <AntDesign name="arrowleft" size={24} color="#fff" style={{ position: 'absolute', top: 40, left: 15 }} onPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.channel}>by {channel}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.price}>Price: {price}</Text>

          {/* <Animated.View style={{ transform: [{ scale: scaleAnim }] }}> */}
            {/* <TouchableOpacity
              style={[styles.button, { backgroundColor: isBought ? '#2E7D32' : '#28a745' }]}
              activeOpacity={0.8}
              onPressIn={handleBuyPressIn}
              onPressOut={handleBuyPressOut}
              disabled={isBought}
            >
              <Text style={styles.buttonText}>{isBought ? 'Bought' : 'Buy Now'}</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isBought ? '#1976D2' : '#607D8B',
                marginTop: 15,
              },
            ]}
            activeOpacity={isBought ? 0.8 : 1}
            onPress={handleWatch}
            disabled={!isBought}
          >
            <Text style={styles.buttonText}>Watch Now</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#2D2D2D', 
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#FFFFFF', 
  },
  channel: {
    fontSize: 16,
    color: '#BDBDBD', 
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
    color: '#E0E0E0', 
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50', 
    marginBottom: 20,
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CourseDetail;
function setLoadingStatus(arg0: boolean) {
  throw new Error('Function not implemented.');
}

