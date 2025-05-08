// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { setDoc, doc } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig';
// import { useRouter } from 'expo-router';

// const RegisterAdmin = () => {
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleRegister = async () => {
//     if (!email || !password || !name) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     const adminEmailPattern = /^admin.*@gmail\.com$/;
//     if (!adminEmailPattern.test(email)) {
//       Alert.alert('Access Denied', 'You are not an admin');
//       return; 
//     }

//     setLoading(true);
//     try {
//       console.log("Starting user registration...");
//       const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
//       console.log("User registered:", userCredential.user);
//       const uid = userCredential.user.uid;

//       console.log("Saving user to Firestore...");
//       await setDoc(doc(FIREBASE_DB, 'users', email), {
//         uid,
//         name,
//         email,
//         password,
//         role: 'admin',
//       });
//       console.log("User saved to Firestore successfully");

//       Alert.alert('Success', 'Admin registered successfully!');
//       router.replace('/');
//     } catch (err: any) {
//       console.error("Error during registration:", err);
//       Alert.alert('Registration Error', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register Admin</Text>
//       <TextInput
//         placeholder="Name"
//         placeholderTextColor="#888"
//         style={styles.input}
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         placeholder="Email"
//         placeholderTextColor="#888"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         placeholder="Password"
//         placeholderTextColor="#888"
//         secureTextEntry
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Pressable onPress={handleRegister} style={styles.button}>
//         <Text style={styles.buttonText}>Register Admin</Text>
//       </Pressable>
//       {loading && <ActivityIndicator size="large" color="#0000ff" />}
//     </View>
//   );
// };

// export default RegisterAdmin;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: '#dc3545',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: 'white',
//     textAlign: 'center',
//   },
// });
