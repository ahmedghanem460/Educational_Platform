import { View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable, KeyboardAvoidingView, ToastAndroid, Switch } from 'react-native';
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
  const { setUserDetails } = useContext(UserDetailsContext);
  const auth = FIREBASE_AUTH;
  const router = useRouter();

  const signIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      const userData = {
        name: user.displayName || '',
        email: user.email || '',
        password,
        uid: user.uid,
        role: isAdmin ? 'admin' : 'user', 
      };

      setUserDetails(userData);

    
      if (isAdmin) {
        router.replace('/Admin/AdminDashboard'); 
      } else {
        router.replace('/(tabs)/home'); 
      }
    } catch (error: any) {
      console.error('Error signing in:', error.code, error.message);
      alert('Error signing in: ' + error.message);
      ToastAndroid.show('Incorrect Email & Password', ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          placeholder="Password"
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

        <Pressable onPress={signIn} disabled={loading}>
          <Text style={[styles.button, { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginBottom: 10, color: 'white' }]}>Login</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/(auth)/Register')} disabled={loading}>
          <Text style={[styles.button, { borderColor: 'white' }]}>
            Don't have an account? <Text style={{ color: '#007bff' }}>Register</Text>
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(auth)/RegisterAdmin')} disabled={loading}>
          <Text style={[styles.button, { borderColor: 'white' }]}>
            Want to register as <Text style={{ color: 'red' }}>Admin</Text>?
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
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    color: 'black',
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
});