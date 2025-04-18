import { View, Text, TextInput, ActivityIndicator, Pressable, StyleSheet, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'expo-router'
import { doc, setDoc } from 'firebase/firestore'
import userDetailsContext from '../../context/UserDetailContext'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {userDetails, setUserDetails} = useContext(userDetailsContext)

  const auth = FIREBASE_AUTH;
  const router = useRouter();

  const signUp = async () => {
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      alert('User registered successfully!')
      await saveUser(userCredential.user)
      router.replace('/(tabs)/home') // Go to the main tabs after successful registration
    } catch (error: any) {
      alert('Error registering: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const saveUser = async (user: any) => {
    const userData = {
      name: name,
      email: email,
      password: password,
      uid: user.uid,
    }
    await setDoc(doc(FIREBASE_DB, 'users', email), userData)
    setUserDetails(userData)
  }

  const handleLogin = () => {
    router.push('/(auth)/Login')
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
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

        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        
        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ marginBottom: 10 }}>
          <Text>{showConfirmPassword ? 'Hide Password' : 'Show Password'}</Text>
        </Pressable>

        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        {password !== confirmPassword && password.length > 0 && confirmPassword.length > 0 && (
          <Text style={{ color: 'red' }}>Passwords do not match</Text>
        )}
        {password.length < 9 && password.length > 0 && (
          <Text style={{ color: 'red' }}>Password must be at least 9 characters</Text>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Pressable onPress={signUp} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        )}

        <Pressable onPress={handleLogin}>
          <Text style={styles.link}>Already have an account? <Text style={{color:'#007bff'}}>Login</Text></Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  link: {
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },
  div: {
    borderRadius: 5,
  },
});
