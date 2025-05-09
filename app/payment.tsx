import React, { useState } from 'react';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/FirebaseConfig';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CustomHeader } from './(tabs)/_layout';
import { useCart } from '../context/CartContext';

const Payment = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = params.totalAmount ? parseFloat(params.totalAmount as string) : 0;
  const items = params.items ? JSON.parse(params.items as string) : [];

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !name) {
      Alert.alert('Error', 'Please fill in all payment details');
      return;
    }
    setLoading(true);
    try {
      // Step 1: Add the cart items to 'yourCourses' first
      await addItemsToYourCoursesFromCart();
  
      // Step 2: Clear the user's cart
      await clearUserCart();
  
      // Step 3: Navigate to the profile page
      router.replace('/(tabs)/profile');
  
      Alert.alert(
        'Payment Successful',
        'Thank you for your purchase!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/profile'); // Redirect to profile
            },
          },
        ]
      );
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Something went wrong during payment');
    } finally {
      setLoading(false);
    }
  };
  
  const addItemsToYourCoursesFromCart = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;
  
      const userCartRef = collection(FIREBASE_DB, 'users', user.uid, 'cart');
      const snapshot = await getDocs(userCartRef);
  
      if (snapshot.empty) {
        console.log('No items in the cart.');
        return;
      }
  
      const yourCoursesRef = collection(FIREBASE_DB, 'users', user.uid, 'yourCourses');
  
      // Process each item from the cart and add to yourCourses
      const addPromises = snapshot.docs.map((docSnap) => {
        const item = docSnap.data();
  
        if (!item.id) {
          console.error('Item ID is missing:', item);
          // If ID is missing, generate a fallback ID
          item.id = docSnap.id; // Use the Firestore document ID as the fallback ID
        }
  
        console.log('Adding item to yourCourses:', item);
        return setDoc(doc(yourCoursesRef, item.id), { ...item, purchasedAt: new Date() });
      });
  
      await Promise.all(addPromises);
      console.log('Items from cart added to yourCourses.');
    } catch (error) {
      console.error('Error adding items to yourCourses:', error);
    }
  };
  
  const clearUserCart = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;
  
      const userCartRef = collection(FIREBASE_DB, 'users', user.uid, 'cart');
      const snapshot = await getDocs(userCartRef);
  
      const deletePromises = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(FIREBASE_DB, 'users', user.uid, 'cart', docSnap.id))
      );
  
      await Promise.all(deletePromises);
      console.log('User cart cleared.');
    } catch (error) {
      console.error('Error clearing user cart:', error);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        {items.map((item: any) => (
          <View key={item.id} style={styles.summaryItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Amount:</Text>
          <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
          maxLength={16}
        />
        <TextInput
          style={styles.input}
          placeholder="MM/YY"
          value={expiryDate}
          onChangeText={setExpiryDate}
          maxLength={5}
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="numeric"
          maxLength={3}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Name on Card"
          value={name}
          onChangeText={setName}
        />
      </View>

      <TouchableOpacity
        style={[styles.payButton, loading && { opacity: 0.6 }]}
        onPress={handlePayment}
        disabled={loading}
      >
        <Text style={styles.payButtonText}>
          {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBlock: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  payButton: {
    backgroundColor: '#6C5CE7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Payment;
