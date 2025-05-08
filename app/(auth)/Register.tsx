import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useContext } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import UserDetailsContext from '../../context/UserDetailContext';

// Import Picker from @react-native-picker/picker
import { Picker } from '@react-native-picker/picker';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');  // Default role is 'user'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUserDetails } = useContext(UserDetailsContext);
  const router = useRouter();

  // Updated Password Regex (at least 9 characters long, and any character mix)
  const passwordRegex = /^.{9,}$/;

  const signUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Please fill all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Invalid email address.');
      return;
    }

    // Check password against regex
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 9 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;

      // Generate cartId automatically using the user's UID
      const cartId = `cart-${user.uid}`;

      // Step 2: Create user document in Firestore with the user data
      const userData = {
        uid: user.uid,
        name,
        email,
        role, // Role chosen by the user (either 'user' or 'admin')
        cartItems: [],  // Initialize cartItems as an empty array
        cartId, // Automatically generated cartId
        createdAt: new Date(),
      };

      // Store user data in Firestore's 'users' collection
      await setDoc(doc(FIREBASE_DB, 'users', user.uid), userData);

      // Set user details in context (for future use in the app)
      setUserDetails(userData);
      console.log('User details set in context:', userData);

      // Step 3: Reset form and redirect after successful registration
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      alert('User registered successfully!');
      router.replace('/(tabs)/home');
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use. Please choose another one.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger one.';
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.toggleText}>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Text style={styles.toggleText}>{showConfirmPassword ? 'Hide Confirm Password' : 'Show Confirm Password'}</Text>
        </Pressable>

        {/* Role Selection Dropdown */}
        <Text style={styles.label}>Select Role:</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Pressable style={styles.registerButton} onPress={signUp}>
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>
        )}

        <Pressable onPress={() => router.push('/(auth)/Login')}>
          <Text style={styles.loginLink}>Already have an account? <Text style={{ color: '#007bff' }}>Login</Text></Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  toggleText: {
    marginBottom: 10,
    color: '#007bff',
    textAlign: 'right',
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: 10,
  },
});
