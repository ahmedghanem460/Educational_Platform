// screens/Cart.tsx

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/FirebaseConfig';
import UserDetailsContext from '../context/UserDetailContext';

const Cart = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails(data as any); // safe now since interface matches
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  console.log('User Details:', userDetails);
  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.loginPrompt}>Please log in to view your cart.</Text>
      </View>
    );
  }

  const cartItems = userDetails.cartItems || [];

  const handleRemoveFromCart = (cartItemId: string) => {
    console.log('Removing item:', cartItemId);
    // TODO: Remove logic (Firebase update)
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
    // TODO: Checkout navigation
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.cartItemImage} />
              <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemTitle}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>${item.price}</Text>
                <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFromCart(item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    marginBlock:40,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#555',
  },
  cartItemQuantity: {
    fontSize: 14,
    color: '#888',
  },
  removeButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginPrompt: {
    fontSize: 16,
    color: '#888',
  },
});

export default Cart;
