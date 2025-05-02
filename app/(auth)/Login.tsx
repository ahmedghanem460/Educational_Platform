import { View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable, KeyboardAvoidingView, ToastAndroid, Switch } from 'react-native';
import React, { useState, useContext } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import UserDetailsContext from '../../context/UserDetailContext';

interface UserDetails {
  name: string;
  email: string;
  password: string;
  uid: string;
  role: 'admin' | 'user';
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ دي اللي بتحدد هل المستخدم داخل كأدمن
  const [loading, setLoading] = useState(false);
  const { setUserDetails } = useContext(UserDetailsContext);
  const auth = FIREBASE_AUTH;
  const router = useRouter();

  const signIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await getUserDetails();
    } catch (error: any) {
      console.error('Error signing in:', error.code, error.message);
      alert('Error signing in: ' + error.message);
      ToastAndroid.show('Incorrect Email & Password', ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await getDoc(doc(FIREBASE_DB, 'users', email));
      const userData = res.data();
      console.log(userData);
      if (userData) {
        // ✅ تحقق من الدور
        if (isAdmin && userData.role !== 'admin') {
          alert('You are not registered as an admin');
          return;
        }
        setUserDetails(userData as UserDetails);

        // ✅ وجه حسب الدور
        if (userData.role === 'admin') {
          router.replace('/adminDashboard');
        } else {
          router.replace('/(tabs)/home');
        }
      } else {
        alert('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Error fetching user data');
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

        {/* ✅ اختيار تسجيل الدخول كأدمن */}
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
  <Text style={[styles.button, { borderColor: "white" }]}>
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
