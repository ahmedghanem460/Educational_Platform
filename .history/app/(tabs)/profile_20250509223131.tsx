import React, { useState, useCallback } from 'react'; 
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore'; 
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { updateProfile } from 'firebase/auth';

const Profile = () => {
  const [userProfile, setUserProfile] = useState<any>(null); 
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const fetchUserProfileAndCourses = useCallback(async () => {
    setLoading(true);
    const currentUser = FIREBASE_AUTH.currentUser;

    if (currentUser) {
      let combinedUserProfile: any = { ...currentUser }; 

      try {
        const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const firestoreUserData = userDocSnap.data();
          combinedUserProfile = { ...combinedUserProfile, ...firestoreUserData };
        } else {
          console.log("Profile.js: User document not found in Firestore for UID:", currentUser.uid);
        }

        const coursesRef = collection(FIREBASE_DB, 'users', currentUser.uid, 'courses');
        const courseQuerySnapshot = await getDocs(coursesRef);
        const userCourses = courseQuerySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(userCourses);

      } catch (error) {
        console.error("Error fetching user profile data or courses:", error);
      } finally {
        setUserProfile(combinedUserProfile);
        setLoading(false);
      }
    } else {
      setUserProfile(null);
      setCourses([]);
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfileAndCourses();
    }, [fetchUserProfileAndCourses])
  );

  const logout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      Alert.alert('Logged out', 'You have been logged out successfully.');
      router.replace('/(auth)/Login'); 
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const pickFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission required", "You've refused to allow this app to access your photos!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8, 
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        await uploadImage(imageUri);
      }
    } catch (error) {
        console.error("Error picking image from gallery:", error);
        Alert.alert('Error', 'Could not open image gallery.');
    }
  };

  const pickFromCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission required", "You've refused to allow this app to access your camera!");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        await uploadImage(imageUri);
      }
    } catch (error) {
        console.error("Error taking photo with camera:", error);
        Alert.alert('Error', 'Could not open camera.');
    }
  };


  const uploadImage = async (imageUri: string) => {
    setUploading(true);
    const data = new FormData();
    const filename = imageUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    data.append('file', { uri: imageUri, name: filename, type } as any);
    data.append('upload_preset', 'Amr_Ahmed'); 
    data.append('cloud_name', 'dhjk6epbm');   

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dhjk6epbm/image/upload`, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageUrl = res.data.secure_url;
      await saveImageUrlToFirebase(imageUrl);
      Alert.alert('Success', 'Profile image updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload image. Please try again.';
      if (axios.isAxiosError(error) && error.response) {
        console.error('Cloudinary error response:', error.response.data);
        errorMessage += ` (Server: ${error.response.data?.error?.message || 'Unknown error'})`;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const saveImageUrlToFirebase = async (url: string) => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) return;

    try {
      await updateProfile(currentUser, {
        photoURL: url,
      });

      const userRef = doc(FIREBASE_DB, 'users', currentUser.uid);
      await setDoc(userRef, { photoURL: url }, { merge: true });

      setUserProfile((prevProfile: any) => ({
        ...prevProfile, 
        photoURL: url,  
        uid: prevProfile?.uid || currentUser.uid,
        email: prevProfile?.email || currentUser.email,
        displayName: prevProfile?.displayName || currentUser.displayName,
      }));

    } catch (error) {
      console.error('Save URL error:', error);
      Alert.alert('Error', 'Failed to save profile image URL.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.center}>
        <Text style={{color: '#fff'}}>User not logged in or profile not found.</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/(auth)/Login')}>
            <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profileDisplayName = userProfile.name || userProfile.displayName || userProfile.email?.split('@')[0] || 'User';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={pickFromGallery} disabled={uploading}>
          <Image
            source={userProfile.photoURL ? { uri: userProfile.photoURL } : require('../../assets/images/Screenshot 2025-05-07 201954.png')} 
            style={styles.avatar}
          />
          {uploading && (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.info}>
          {/* Use the derived profileDisplayName here */}
          <Text style={styles.name}>{profileDisplayName}</Text>
          <Text style={styles.email}>{userProfile.email || 'No email available'}</Text>
        </View>
        <TouchableOpacity style={[styles.actionBtn, styles.logoutBtn]} onPress={logout}>
          <Text style={[styles.actionBtnText, { color: '#FF6B6B' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickFromGallery} disabled={uploading}>
          <Text style={styles.imagePickerButtonText}>From Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickFromCamera} disabled={uploading}>
          <Text style={styles.imagePickerButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>My Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => router.push({
              pathname: '/courseDetails', // Ensure this route exists
              params: {
                courseId: item.id, // Good to pass ID
                title: item.title,
                description: item.description,
                price: item.price,
                image: item.image,
                url: item.url,
                channel: item.channel,
              }
            })}
          >
            <Image
              source={item.image && typeof item.image === 'string' && item.image.startsWith('http') ? { uri: item.image } : require('../../assets/images/Screenshot 2025-05-07 201954.png')} // Default course image
              style={styles.courseImage}
            />
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{item.name || 'Unnamed Course'}</Text>
              <Text style={styles.courseChannel}>{item.Channel || 'Unknown Channel'}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.courseList}
        ListEmptyComponent={<Text style={{ color: '#999', textAlign: 'center', marginTop: 20 }}>You haven't enrolled in any courses yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  uploadOverlay: {
    position: 'absolute',
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  actionBtn: { // General style for action buttons like logout
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  actionBtnText: { // Text for action buttons
    fontSize: 14,
    fontWeight: '500',
    color: '#fff', // Default white, can be overridden
  },
  logoutBtn: {
    // specific styles for logout if needed, e.g., backgroundColor: 'transparent'
  },
  imagePickerButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 15,
    marginTop: 10,
  },
  courseList: {
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#333',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#E0E0E0',
  },
  courseChannel: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 4,
  },
});

export default Profile;