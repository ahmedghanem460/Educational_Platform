import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Payment = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const totalAmount = params.totalAmount ? parseFloat(params.totalAmount as string) : 0;
  const items = params.items ? JSON.parse(params.items as string) : [];

  const handlePayment = () => {
    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !name) {
      Alert.alert('Error', 'Please fill in all payment details');
      return;
    }

    // Here you would typically integrate with a payment gateway
    // For now, we'll just show a success message
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

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay ${totalAmount.toFixed(2)}</Text>
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
    color: '#28a745',
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
    backgroundColor: '#28a745',
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