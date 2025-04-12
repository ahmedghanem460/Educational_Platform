import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const CourseDetail = () => {
  const params = useLocalSearchParams();

  const title = params.title as string;
  const description = params.description as string;
  const price = params.price as string;
  const image = params.image as string;
  const channel = params.channel as string;
  const url = params.url as string;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isBought, setIsBought] = useState(false);

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
    }).start(() => {
      setIsBought(true);
    });
  };

  const handleWatch = () => {
    if (isBought) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.channel}>by {channel}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.price}>Price: {price}</Text>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#28a745' }]}
              activeOpacity={0.8}
              onPressIn={handleBuyPressIn}
              onPressOut={handleBuyPressOut}
            >
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isBought ? '#007bff' : '#ccc',
                marginTop: 15,
              },
            ]}
            activeOpacity={isBought ? 0.8 : 1}
            onPress={handleWatch}
            disabled={!isBought}
          >
            <Text style={styles.buttonText}>Watch Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CourseDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#f1f1f1', // لون الخلفية خلف الصورة ليبرز الظل
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
    width: '90%',
    height: '90%',
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
  },
  channel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
    color: '#444',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
