// import React, { useRef, useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Animated,
//   Linking,
//   Alert,
//   ImageSourcePropType,
//   ImageURISource
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { FIREBASE_AUTH, FIREBASE_DB } from '../config/FirebaseConfig';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import { AntDesign } from '@expo/vector-icons';

// const CourseDetail = () => {
//   const params = useLocalSearchParams();
//   const router = useRouter();

//   const title = params.title as string;
//   const description = params.description as string;
//   const price = params.price as string;
//   const channel = params.channel as string;
//   const url = params.url as string;
  
//   const getImageSource = (): ImageSourcePropType => {
//     if (typeof params.image === 'string') {
//       return { uri: params.image };
//     }
//     return params.image as ImageSourcePropType;
//   };

//   const imageSource = getImageSource();

//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const [isBought, setIsBought] = useState(false);

//   const user = FIREBASE_AUTH.currentUser;
  
//   useEffect(() => {
//     const checkCourseStatus = async () => {
//       if (user) {
//         const courseRef = doc(FIREBASE_DB, 'users', user.uid, 'courses', title);
//         const docSnap = await getDoc(courseRef);
//         if (docSnap.exists()) {
//           setIsBought(true);
//         }
//       }
//     };
//     checkCourseStatus();
//   }, [user, title]);

//   const handleBuyPressIn = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 0.95,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleBuyPressOut = async () => {
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start(async () => {
//       if (user) {
//         try {
//           await setDoc(
//             doc(FIREBASE_DB, 'users', user.uid, 'courses', title),
//             { 
//               title, 
//               description, 
//               price, 
//               image: typeof params.image === 'string' ? params.image : (params.image as ImageURISource).uri,
//               channel, 
//               url 
//             },
//             { merge: true }
//           );
//           setIsBought(true);
//           Alert.alert('Success', 'Course purchased successfully!', [
//             { text: 'OK', onPress: () => handleWatch() }
//           ]);
//         } catch (error) {
//           console.error("Error buying course: ", error);
//         }
//       }
//     });
//   };

//   const handleWatch = () => {
//     if (isBought) {
//       Linking.openURL(url);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <AntDesign name="arrowleft" size={24} color="#fff" style={{ position: 'absolute', top: 40, left: 15 }} onPress={() => router.back()} />
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.imageContainer}>
//           <Image 
//             source={imageSource}
//             style={styles.image}
//             resizeMode="contain"
//           />
//         </View>
//         <View style={styles.content}>
//           <Text style={styles.title}>{title}</Text>
//           <Text style={styles.channel}>by {channel}</Text>
//           <Text style={styles.description}>{description}</Text>
//           <Text style={styles.price}>Price: {price}</Text>

//           {/* <Animated.View style={{ transform: [{ scale: scaleAnim }] }}> */}
//             {/* <TouchableOpacity
//               style={[styles.button, { backgroundColor: isBought ? '#2E7D32' : '#28a745' }]}
//               activeOpacity={0.8}
//               onPressIn={handleBuyPressIn}
//               onPressOut={handleBuyPressOut}
//               disabled={isBought}
//             >
//               <Text style={styles.buttonText}>{isBought ? 'Bought' : 'Buy Now'}</Text>
//             </TouchableOpacity>
//           </Animated.View>

//           <TouchableOpacity
//             style={[
//               styles.button,
//               {
//                 backgroundColor: isBought ? '#1976D2' : '#607D8B',
//                 marginTop: 15,
//               },
//             ]}
//             activeOpacity={isBought ? 0.8 : 1}
//             onPress={handleWatch}
//             disabled={!isBought}
//           >
//             <Text style={styles.buttonText}>Watch Now</Text>
//           </TouchableOpacity> */}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1E1E1E', 
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   imageContainer: {
//     width: '100%',
//     height: 250,
//     backgroundColor: '#2D2D2D', 
//     borderRadius: 20,
//     marginBottom: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 20,
//   },
//   content: {
//     alignItems: 'center',
//     width: '100%',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     textAlign: 'center',
//     color: '#FFFFFF', 
//   },
//   channel: {
//     fontSize: 16,
//     color: '#BDBDBD', 
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 15,
//     textAlign: 'center',
//     marginBottom: 10,
//     color: '#E0E0E0', 
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#4CAF50', 
//     marginBottom: 20,
//   },
//   button: {
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default CourseDetail;
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
  ImageURISource,
  Platform // Added Platform
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
    // If it's not a string, assume it's already a valid ImageSourcePropType (e.g., from require())
    // However, params usually come as strings. Consider how non-string images are passed.
    return params.image as ImageSourcePropType;
  };

  const imageSource = getImageSource();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isBought, setIsBought] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true); // To show loading for course status

  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const checkCourseStatus = async () => {
      if (user && title) { // Ensure title is available
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

  const handleBuyPressOut = () => { // Changed to simple onPress for clarity, animation can be added back
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    // Actual buy logic moved to a separate function called by onPress
  };

  const executePurchase = async () => {
    if (user && title) { // Ensure title is available
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

  const handleWatch = async () => {
    if (url) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert("Error", `Don't know how to open this URL: ${url}`);
        }
    } else {
        Alert.alert("Error", "No watch URL provided for this course.");
    }
  };

  // Uncommented Buy and Watch buttons with improved logic
  const BuyButton = () => (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '90%', alignItems: 'center' }}>
      <TouchableOpacity
        style={[styles.button, styles.buyButton, isBought && styles.boughtButton]}
        activeOpacity={0.8}
        onPressIn={handleBuyPressIn}
        onPressOut={handleBuyPressOut} // For animation reset
        onPress={executePurchase} // For actual action
        disabled={isBought || loadingStatus}
      >
        {loadingStatus ? (
            <Text style={styles.buttonText}>Checking Status...</Text>
        ) : isBought ? (
            <Text style={styles.buttonText}>Purchased</Text>
        ) : (
            <Text style={styles.buttonText}>Buy Now for {price}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const WatchButton = () => (
    <TouchableOpacity
      style={[
        styles.button,
        styles.watchButton,
        (!isBought || loadingStatus) && styles.disabledButton, // Apply disabled style
        { width: '90%', alignItems: 'center' } // Ensure button takes width
      ]}
      activeOpacity={isBought ? 0.8 : 1}
      onPress={handleWatch}
      disabled={!isBought || loadingStatus}
    >
      <Text style={styles.buttonText}>Watch Now</Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      {/* Header View */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.headerButton}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title || "Course Detail"}</Text>
        <View style={styles.headerButton} /> {/* Spacer */}
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover" // Changed to cover for better aesthetics usually
          />
        </View>
        <View style={styles.content}>
          {/* Title is now in header, can be removed or kept here as well */}
          {/* <Text style={styles.title}>{title}</Text> */}
          <Text style={styles.channelText}>Provider: {channel || 'N/A'}</Text>
          <Text style={styles.description}>{description || 'No description available.'}</Text>
          

          {/* Buy and Watch Buttons */}
          <BuyButton />
          <WatchButton />

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Darker background
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : 50, // Adjust for status bar
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#1E1E1E', // Header background
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerButton: {
    padding: 5,
    width: 40, // For balance
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // Allow title to take space and truncate
    marginHorizontal: 10,
  },
  // Scroll Content Styles
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    maxWidth: 400, // Max width for larger screens
    aspectRatio: 16 / 9, // Maintain aspect ratio
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    marginBottom: 25,
    overflow: 'hidden', // Ensure image respects border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10, // Padding for content within the scroll view
  },
  // title style removed as it's in header, can be added back if needed
  channelText: { // Renamed from channel for clarity
    fontSize: 16,
    color: '#BDBDBD',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 15,
    lineHeight: 22, // Better readability
    textAlign: 'left', // Usually better for longer text
    marginBottom: 20,
    color: '#E0E0E0',
    width: '100%', // Ensure it takes full width for alignment
  },
  // priceText style removed as it's in button, can be added back if needed
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25, // More rounded buttons
    width: '90%', // Make buttons take significant width
    alignItems: 'center', // Center text in button
    marginBottom: 15, // Space between buttons
    elevation: 3,
  },
  buyButton: {
    backgroundColor: '#4CAF50', // Green for buy
  },
  boughtButton: {
    backgroundColor: '#2E7D32', // Darker green for bought
    opacity: 0.7,
  },
  watchButton: {
    backgroundColor: '#2196F3', // Blue for watch
  },
  disabledButton: { // Style for disabled watch button
    backgroundColor: '#607D8B',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CourseDetail;