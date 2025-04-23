import React, { useState } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
          setUser(currentUser);
          try {
            const coursesRef = collection(FIREBASE_DB, 'users', currentUser.uid, 'courses');
            const querySnapshot = await getDocs(coursesRef);
            const userCourses = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            if (isActive) {
              setCourses(userCourses);
            }
          } catch (error) {
            console.error("Error fetching user courses:", error);
          } finally {
            if (isActive) setLoading(false);
          }
        } else {
          setLoading(false);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const logout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      Alert.alert('Logged out', 'You have been logged out successfully.');
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>User not logged in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={user.photoURL ? { uri: user.photoURL } : require('../../assets/images/Basha El Balaaaad.jpg')} 
          style={styles.avatar} 
        />
        <View style={styles.info}>
          <Text style={styles.name}>{user.displayName || user.email?.split('@')[0] || 'User'}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <TouchableOpacity style={[styles.btn, styles.logoutBtn]} onPress={logout}>
          <Text style={[styles.btnText, { color: 'red' }]}>Logout</Text>
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
              pathname: '/courseDetails',
              params: {
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
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
              style={styles.courseImage}
            />
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{item.title || 'No Title'}</Text>
              <Text style={styles.courseChannel}>{item.channel}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.courseList}
        ListEmptyComponent={<Text style={{ color: '#777' }}>No courses yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f9fc',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#eef1f4',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutBtn: {
    backgroundColor: '#ffecec',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  courseList: {
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 16,
    color: '#333',
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  courseInfo: {
    flex: 1,
  },
  courseChannel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default Profile;