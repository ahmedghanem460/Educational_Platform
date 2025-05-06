import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_DB } from "../config/FirebaseConfig";
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { doc, deleteDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

type CartItem = {
  id: string;
  name: string;
  price: string; // Ensure this is a string from Firestore
  image: string;
  quantity: number;
};

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);  // State to hold cart items
  const [totalPrice, setTotalPrice] = useState<number>(0);  // State to hold total price
  const [loading, setLoading] = useState<boolean>(true);  // State to manage loading state
  const [error, setError] = useState<string | null>(null);  // Error state for fetch failures

  // Fetch cart items from Firestore
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const cartCollection = collection(FIREBASE_DB, "cart");
        const cartSnapshot = await getDocs(cartCollection);

        const cartData: CartItem[] = cartSnapshot.docs.map(doc => ({
          id: doc.id,  // document id
          name: doc.data().name,
          price: doc.data().price,
          image: doc.data().image,
          quantity: doc.data().quantity,
        }));

        setCartItems(cartData);
        calculateTotalPrice(cartData);  // Calculate total price after fetching cart data
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error fetching cart items.");
        console.error("Error fetching cart items: ", error);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate total price of items in the cart
  const calculateTotalPrice = (cartData: CartItem[]) => {
    const total = cartData.reduce((acc, item) => {
      // Initialize variables outside the if statement
      let price = 0;
      let quantity = 0;
      
      if (item && item.price !== undefined) {
        // Handle price - convert to string first in case it's already a number
        price = parseFloat(String(item.price).replace(/[^0-9.-]+/g, ''));
        
        // Handle quantity - ensure it's a number and default to 1 if not specified
        quantity = typeof item.quantity === 'number' ? item.quantity : 
                  (parseInt(String(item.quantity), 10) || 1);
        
        console.log(`Item: ${item.name}, Price: ${price}, Quantity: ${quantity}`);
        console.log('item.price', item.price);
        
        // Only add to accumulator if both values are valid numbers
        if (!isNaN(price) && !isNaN(quantity)) {
          return acc + (price * quantity);
        }
      } else {
        console.log('Skipping item with undefined price:', item);
      }
      
      return acc;  // Return unchanged accumulator for invalid items
    }, 0);
    
    console.log(`Total Price: ${total}`);
    setTotalPrice(total);
  };

  // Remove item from cart (to be implemented in Firestore)
  const removeFromCart = async (id: string) => {
    try {
      // Reference to the specific document you want to delete
      const itemRef = doc(FIREBASE_DB, "cart", id);  // 'cart' is your collection name, 'id' is the document ID

      // Delete the document from Firestore
      await deleteDoc(itemRef);

      // Update local state after deletion
      setCartItems(prevItems => {
        const updatedItems = prevItems.filter(item => item.id !== id);
        calculateTotalPrice(updatedItems);  // Recalculate total price
        return updatedItems;
      });

      alert(`Item with ID ${id} removed from cart`);
    } catch (error) {
      console.error("Error removing item from cart: ", error);
      alert("There was an error removing the item from the cart.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={styles.backButton} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#B2BEC3" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => router.push("/(tabs)/courseListing")}
          >
            <Text style={styles.continueShoppingText}>Browse Courses</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.cartList}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image 
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                  <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => removeFromCart(item.id)} 
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.checkoutContainer}>
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.push({
                pathname: "/payment",
                params: {
                  totalAmount: totalPrice,
                  items: JSON.stringify(cartItems)
                }
              })}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F6FA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#636E72',
    marginTop: 16,
    marginBottom: 24,
    fontWeight: '500',
  },
  continueShoppingButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  continueShoppingText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6C5CE7",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#636E72",
  },
  removeButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  checkoutContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  priceBreakdown: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingTop: 12,
    marginTop: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  checkoutButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Cart;
