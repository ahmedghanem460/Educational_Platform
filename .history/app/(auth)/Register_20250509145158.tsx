import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import React, { useState, useContext } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import UserDetailsContext from '../../context/UserDetailContext';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Alert } from 'react-native';

const saveUser = async (firebaseUser: any) => { 
  const userDataForFirestore = {
    uid: firebaseUser.uid,
    name: name, 
    email: firebaseUser.email, 
    role: 'user',
    cartItems: [],
    createdAt: new Date().toISOString(), 
  };

  console.log('Saving user data to Firestore:', firebaseUser.uid);
  try {
    await setDoc(doc(FIREBASE_DB, 'users', firebaseUser.uid), userDataForFirestore);
    console.log('User data saved to Firestore successfully');
    setUserDetails(userDataForFirestore);
  } catch (error) {
    console.error("Error saving user data to Firestore or updating Auth profile:", error);
    Alert.alert('Error', 'Failed to save user data. Please try again.');
    throw error;
  }
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setUserDetails } = useContext(UserDetailsContext);

  const auth = FIREBASE_AUTH;
  const router = useRouter();

  const validateInputs = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ToastAndroid.show('Please enter a valid email', ToastAndroid.SHORT);
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      return false;
    }

    return true;
  };

  const signUp = async () => {
    console.log('Register button clicked');

    if (!validateInputs()) {
      console.log('Validation failed');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', userCredential.user.uid);

      await saveUser(userCredential.user);

      ToastAndroid.show('Registration successful!', ToastAndroid.LONG);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error('Registration error:', error.code, error.message);

      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }

      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (user: any) => {
  //   const userData = {
  //     name,
  //     email,
  //     password,
  //     uid: user.uid,
  //     role: 'user',
  //     cartItems: [],
  //   };

  //   console.log('Saving user to Firestore:', user.uid);
  //   await setDoc(doc(FIREBASE_DB, 'users', user.uid), userData);
  //   setUserDetails(userData);
  //   console.log('User saved successfully');
  // };

  return (
    <View style={styles.container}>
      <AntDesign name="arrowleft" size={24} color="#fff" style={{ position: 'absolute', top: 40, left: 15 }} onPress={() => router.back()} />
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us to get started</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholderTextColor="#888"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholderTextColor="#888"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholderTextColor="#888"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholderTextColor="#888"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
          </Pressable>
        </View>

        <Pressable
          onPress={signUp}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </Pressable>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/(auth)/Login')}>
            <Text style={styles.signupLink}> Login</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  icon: {
    padding: 15,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    paddingRight: 15,
  },
  eyeIcon: {
    padding: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#aaa',
  },
  signupLink: {
    color: '#007bff',
    fontWeight: '600',
  },
});

export default Register;
function setUserDetails(userDataForFirestore: {
  uid: any; name: void; // Name from the registration form input
  email: any; // Email from the authenticated Firebase user object
  role: string; cartItems: never[]; createdAt: string;
}) {
  throw new Error('Function not implemented.');
}

