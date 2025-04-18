import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Pressable, KeyboardAvoidingView, ToastAndroid } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'expo-router'
import { doc, getDoc, DocumentData } from 'firebase/firestore'

interface UserDetails {
    name: string;
    email: string;
    password: string;
    uid: string;
}
import { useContext } from 'react'
import UserDetailsContext from '../../context/UserDetailContext'


const Login = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const {userDetails, setUserDetails} = useContext(UserDetailsContext)
    const auth = FIREBASE_AUTH;
    const router = useRouter();
    const signIn = async () => {
        setLoading(true)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            // console.log('User signed in:', user)
            alert('User signed in successfully!')
            await getUserDetails()
            router.replace('/(tabs)/home'); // Navigate to the main page or adjust to a valid route
        } catch (error : any) {
            const errorCode = error.code
            const errorMessage = error.message
            console.error('Error signing in:', errorCode, errorMessage)
            alert('Error signing in: ' + errorMessage)
            ToastAndroid.show('Incorrect Email & Password', ToastAndroid.BOTTOM)
        } finally {
            setLoading(false)
        }
    }

    const getUserDetails = async () => {
            const res = await getDoc(doc(FIREBASE_DB, 'users', email));
            console.log(res.data())
            const userData = res.data();
            if (userData) {
                setUserDetails(userData as UserDetails);
            } else {
                console.error('User data is undefined or incomplete');
                alert('Failed to fetch user details');
            }
        }

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
            <Pressable onPress={signIn} disabled={loading}>
                <Text style={[styles.button, {backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginBottom: 10, color:"white"}]}>Login</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/(auth)/Register')} disabled={loading}>
                <Text style={[styles.button, {borderColor:"white"}]}>Don't have an account? <Text style={{color:'#007bff'}}>Register</Text></Text>
            </Pressable>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {/* <Button title="Sign Up" onPress={signUp} disabled={loading} /> */}
        </KeyboardAvoidingView>
    </View>
  )
}

export default Login
//rnfe did that

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
});
