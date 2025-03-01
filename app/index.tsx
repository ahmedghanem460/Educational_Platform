import { View, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';

const PlaceholderImage = require('@/assets/images/photo.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
      We are a team of passionate developers working on this exciting project
      our goal is to create an app about Educational platform 
      </Text>
      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image} />
      </View>
      <Text style={styles.text}>
       you should know that We will do all we have to improve you to be able to take Full Marks
      </Text>
      <Text style={styles.text}>
      let me tell you our Team
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, 
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10, 
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10, 
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});


