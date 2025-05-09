import { View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import React, { useState, useContext } from 'react';
import { FIREBASE_AUTH } from '../../config/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import UserDetailsContext from '../../context/UserDetailContext';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user');
  const { setUserDetails } = useContext(UserDetailsContext);
  const auth = FIREBASE_AUTH;
  const router = useRouter();


  const ADMIN_EMAIL = 'ghanem@gmail.com';

  const validateInputs = () => {
    if (!email.trim() || !password.trim()) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ToastAndroid.show('Please enter a valid email', ToastAndroid.SHORT);
      return false;
    }
    
    if (password.length < 6) {
      ToastAndroid.show('Password must be at least 6 characters', ToastAndroid.SHORT);
      return false;
    }
    
    return true;
  };

  const signIn = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (selectedRole === 'admin') {
    
        const isAdminEmail = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        
        if (!isAdminEmail) {
          ToastAndroid.show("Your email is not authorized as admin", ToastAndroid.LONG);
          setLoading(false);
          return;
        }
 
        const userData = {
          name: user.displayName || '',
          email: user.email || '',
          uid: user.uid,
          role: 'admin',
          cartItems: [],
        };
        
        setUserDetails(userData);
        router.replace('/Admin/AdminDashboard');
        return;
      }

      const userData = {
        name: user.displayName || '',
        email: user.email || '',
        uid: user.uid,
        role: 'user',
        cartItems: [],
      };

      setUserDetails(userData);
      router.replace('/(tabs)/home');

    } catch (error: any) {
      console.error('Error signing in:', error.code, error.message);
      let errorMessage = 'Incorrect email or password';
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Try again later or reset your password.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid login credentials';
      }
      
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
    <AntDesign name="arrowleft" size={24} color="#fff" style={{ position: 'absolute', top: 40, left: 15 }} onPress={() => router.back()} />
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.roleSwitcher}>
          <Pressable
            onPress={() => setSelectedRole('user')}
            style={[
              styles.roleButton,
              selectedRole === 'user' && styles.activeRoleButton
            ]}
          >
            <Ionicons name="person-outline" size={16} color="#fff" />
            <Text style={styles.roleButtonText}> Login as User</Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedRole('admin')}
            style={[
              styles.roleButton,
              selectedRole === 'admin' && styles.activeRoleButton
            ]}
          >
            <Ionicons name="shield-outline" size={16} color="#fff" />
            <Text style={styles.roleButtonText}> Login as Admin</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

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
            autoCorrect={false}
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
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
          </Pressable>
        </View>

        <Pressable 
          onPress={signIn} 
          disabled={loading} 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <Pressable onPress={() => router.push('/(auth)/Register')}>
            <Text style={styles.signupLink}> Register Now</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#888',
    fontSize: 14,
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
  roleSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeRoleButton: {
    backgroundColor: '#007bff',
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Login;