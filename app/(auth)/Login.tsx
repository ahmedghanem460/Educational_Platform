import { View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable, KeyboardAvoidingView, ToastAndroid, Switch, Platform } from 'react-native';
import React, { useState, useContext } from 'react';
import { FIREBASE_AUTH } from '../../config/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import UserDetailsContext from '../../context/UserDetailContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserDetails } = useContext(UserDetailsContext) || {}; // Fallback to avoid undefined error
  const auth = FIREBASE_AUTH;
  const router = useRouter();

  const signIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userData = {
        name: user.displayName || '',
        email: user.email || '',
        uid: user.uid,
        role: isAdmin ? 'admin' : 'user',
      };

      if (setUserDetails) {
        setUserDetails(userData); // Set user details in the context
      }

      if (isAdmin) {
        router.replace('/Admin/AdminDashboard');
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      ToastAndroid.show('Incorrect Email or Password', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.title}>Login</Text>
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
        <Pressable onPress={() => setShowPassword(!showPassword)} style={{ marginBottom: 10 }}>
          <Text>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
        </Pressable>

        <View style={styles.switchContainer}>
          <Text>Login as Admin?</Text>
          <Switch value={isAdmin} onValueChange={setIsAdmin} />
        </View>

        <Pressable onPress={signIn} disabled={loading} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/(auth)/Register')} disabled={loading}>
          <Text style={styles.registerLink}>
            Don't have an account? <Text style={{ color: '#007bff' }}>Register</Text>
          </Text>
        </Pressable>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: 10,
  },
});
