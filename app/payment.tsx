import React, { useState } from 'react';
import { updateDoc, doc as firestoreDoc } from 'firebase/firestore';
import { collection, getDocs, deleteDoc, setDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/FirebaseConfig';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
      await clearCart();
      await markCoursesAsBought();

      Alert.alert(
        'Payment Successful',
        'Thank you for your purchase!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear cart and navigate to home
              router.replace('/(tabs)/home');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Something went wrong during payment")
    } finally {
      setLoading(false);
    }
  };
  const clearCart = async () => {
    try {
      const cartCollection = collection(FIREBASE_DB, "cart");
      const cartSnapshot = await getDocs(cartCollection);
      const deletePromises = cartSnapshot.docs.map((docSnap) => deleteDoc(doc(FIREBASE_DB, "cart", docSnap.id)));
      await Promise.all(deletePromises);
      console.log("Cart cleared after payment.");
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };
  const markCoursesAsBought = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;

      for (const item of items) {
        // const courseRef = firestoreDoc(FIREBASE_DB, 'courses', item.id);
        // await updateDoc(courseRef, { status: 'bought' });
        const userCourseRef = firestoreDoc(FIREBASE_DB, 'users', user.uid, 'courses', item.id);
        await setDoc(userCourseRef, {
          title: item.title ?? "Untitled course",
          description: item.description ?? "No description available",
          image: item.image ?? "",
          price: item.price ?? 0,
          url: item.url ?? "",
          channel: item.channel ?? "",
          boughtAt: new Date(),
        });
      }
      console.log('Courses marked as bought.');
    } catch (error) {
      console.error('Erorr making course as bought', error);
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

      <TouchableOpacity style={[styles.payButton, loading && { opacity: 0.6 }]}
        onPress={handlePayment}
        disabled={loading}>
        <Text style={styles.payButtonText}>
          {loading ? 'Processing....' : `Pay $${totalAmount.toFixed(2)}`}</Text>
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