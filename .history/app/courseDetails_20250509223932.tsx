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
  Platform,
  Pressable,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/FirebaseConfig';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, DocumentData, Timestamp } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';

interface Review {
  userId: string;
  userName: string;
  userEmail: string;
  userPhotoURL?: string;
  rating: number;
  review: string;
  timestamp: Timestamp;
  authorProfile?: DocumentData;
}

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

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
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState('');
  const [rating, setRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userExistingReviewId, setUserExistingReviewId] = useState<string | null>(null);
  const [isUpdatingReview, setIsUpdatingReview] = useState(false);

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
        setIsBought(false);
        setLoadingStatus(false);
      }
    };
    checkCourseStatus();
  }, [user, title]);

  useEffect(() => {
    fetchReviews();
  }, [title, user]);

  const fetchReviews = async () => {
    if (!title) return;
    
    
    setLoadingReviews(true);
    try {
      const reviewsRef = collection(FIREBASE_DB, 'courses', title, 'reviews');
      const q = query(reviewsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const reviewsData = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const reviewData = docSnapshot.data();
        let userProfile: DocumentData | undefined = undefined;
        try {
          const userDoc = await getDoc(doc(FIREBASE_DB, 'users', reviewData.userId));
          if (userDoc.exists()) {
            userProfile = userDoc.data();
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
        
        return {
          id: docSnapshot.id,
          ...reviewData,
          userProfile
        } as Review;
      }));
      
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

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

  const submitReview = async () => {
    if (!user || !title) {
      Alert.alert('Error', 'You must be logged in to submit a review');
      return;
    }

    if (!userReview.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setSubmittingReview(true);
    try {
      const reviewData = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email,
        userProfile: {
          photoURL: user.photoURL || DEFAULT_AVATAR,
        },
        rating,
        review: userReview.trim(),
        timestamp: Timestamp.fromDate(new Date()),
      };

      await addDoc(collection(FIREBASE_DB, 'courses', title, 'reviews'), reviewData);
      setUserReview('');
      setRating(0);
      Alert.alert('Success', 'Review submitted successfully!');
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (value: number, size: number = 20) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            disabled={submittingReview}
          >
            <AntDesign
              name={star <= value ? "star" : "staro"}
              size={size}
              color={star <= value ? "#FFD700" : "#666"}
              style={{ marginRight: 2 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const BuyButton = () => (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '90%', alignItems: 'center' }}>
      <TouchableOpacity
        style={[styles.button, styles.buyButton, isBought && styles.boughtButton]}
        activeOpacity={0.8}
        onPressIn={handleBuyPressIn}
        onPressOut={handleBuyPressOut}
        onPress={executePurchase}
        disabled={isBought || loadingStatus}
      >
        <Text style={styles.buttonText}>
          {loadingStatus
            ? 'Checking Status...'
            : isBought
              ? 'Purchased'
              : `Buy Now for ${price}`}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const WatchButton = () => (
    <TouchableOpacity
      style={[
        styles.button,
        styles.watchButton,
        (!isBought || loadingStatus) && styles.disabledButton,
        { width: '90%', alignItems: 'center' }
      ]}
      activeOpacity={isBought ? 0.8 : 1}
      onPress={handleWatch}
      disabled={!isBought || loadingStatus}
    >
      <Text style={styles.buttonText}>Watch Now</Text>
    </TouchableOpacity>
  );

  const ReviewSection = () => (
    <View style={styles.reviewSection}>
      <Text style={styles.sectionTitle}>Reviews</Text>
      
      {isBought && (
        <View style={styles.reviewForm}>
          <View style={styles.reviewerInfo}>
            <Image
              source={
                user?.photoURL
                  ? { uri: user.photoURL }
                  : { uri: DEFAULT_AVATAR }
              }
              style={styles.reviewerAvatar}
            />
            <Text style={styles.reviewerName}>
              {user?.displayName || 'Anonymous'}
            </Text>
          </View>
          <Text style={styles.reviewLabel}>Your Rating:</Text>
          {renderStars(rating)}
          
          <TextInput
            style={styles.reviewInput}
            placeholder="Write your review..."
            value={userReview}
            onChangeText={setUserReview}
            multiline
            numberOfLines={4}
            editable={!submittingReview}
          />
          
          <TouchableOpacity
            style={[styles.submitButton, submittingReview && styles.disabledButton]}
            onPress={submitReview}
            disabled={submittingReview}
          >
            {submittingReview ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {loadingReviews ? (
        <ActivityIndicator style={styles.loader} />
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewerInfo}>
                <Image
                  source={
                    review.userProfile?.photoURL
                      ? { uri: review.userProfile.photoURL }
                      : { uri: DEFAULT_AVATAR }
                  }
                  style={styles.reviewerAvatar}
                />
                <View style={styles.reviewerDetails}>
                  <Text style={styles.reviewerName}>{review.userName}</Text>
                  <Text style={styles.reviewDate}>
                    {review.timestamp.toDate().toLocaleDateString()}
                  </Text>
                </View>
              </View>
              {renderStars(review.rating, 16)}
            </View>
            <Text style={styles.reviewText}>{review.review}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          style={styles.headerButton}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{title || "Course Detail"}</Text>
        <View style={styles.headerButton} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.channelText}>Provider: {channel || 'N/A'}</Text>
          <Text style={styles.description}>{description || 'No description available.'}</Text> 

          <BuyButton />
          <WatchButton />
          
          <ReviewSection />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerButton: {
    padding: 5,
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
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
  channelText: {
    fontSize: 16,
    color: '#BDBDBD',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'left',
    marginBottom: 20,
    color: '#E0E0E0',
    width: '100%',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  boughtButton: {
    backgroundColor: '#2E7D32',
    opacity: 0.7,
  },
  watchButton: {
    backgroundColor: '#2196F3',
  },
  disabledButton: {
    backgroundColor: '#607D8B',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewSection: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  reviewForm: {
    backgroundColor: '#2D2D2D',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  reviewLabel: {
    color: '#FFFFFF',
    marginBottom: 10,
    fontSize: 16,
  },
  reviewInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewCard: {
    backgroundColor: '#2D2D2D',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewText: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  reviewDate: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
  noReviews: {
    color: '#888888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loader: {
    marginVertical: 20,
  },
});

export default CourseDetail;
