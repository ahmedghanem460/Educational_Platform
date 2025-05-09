import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert, Platform, ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FIREBASE_DB, FIREBASE_AUTH } from "../config/FirebaseConfig";
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const showFeedback = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(message);
  }
};

const Cart = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(FIREBASE_AUTH.currentUser);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setCurrentUser(user);
      if (!user) {
        setCartItems([]);
        setTotalPrice(0);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const getCartCollectionRef = useCallback(() => {
    if (!currentUser) return null;
    return collection(FIREBASE_DB, "users", currentUser.uid, "cart");
  }, [currentUser]);

  const fetchCartItems = useCallback(async () => {
    const cartCollection = getCartCollectionRef();
    if (!cartCollection) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cartSnapshot = await getDocs(cartCollection);

      const cartData: CartItem[] = cartSnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          productId: data.productId,
          name: data.name || "Unnamed Product",
          price: typeof data.price === 'string' ? parseFloat(data.price.replace(/[^0-9.]/g, '')) : (data.price || 0),
          image: data.image || 'default_image_url_here',
          quantity: data.quantity || 1,
        };
      });

      setCartItems(cartData);
    } catch (err) {
      setError("Failed to fetch cart items. Please try again.");
      console.error("Error fetching cart items: ", err);
    } finally {
      setLoading(false);
    }
  }, [getCartCollectionRef]);

  useEffect(() => {
    if (currentUser) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [currentUser, fetchCartItems]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return acc + (price * quantity);
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    const cartCollection = getCartCollectionRef();
    if (!cartCollection) return;

    const itemRef = doc(cartCollection, itemId);
    try {
      await updateDoc(itemRef, { quantity: newQuantity });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      showFeedback("Cart updated.");
    } catch (err) {
      console.error("Error updating item quantity: ", err);
      showFeedback("Failed to update quantity.");
    }
  };

  const removeFromCart = async (itemId: string) => {
    const cartCollection = getCartCollectionRef();
    if (!cartCollection) return;

    const itemRef = doc(cartCollection, itemId);
    try {
      await deleteDoc(itemRef);
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      showFeedback("Item removed from cart.");
    } catch (err) {
      console.error("Error removing item from cart: ", err);
      showFeedback("Failed to remove item.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={styles.loadingText}>Loading Cart...</Text>
      </View>
    );
  }

  if (!currentUser) {
     return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="log-in-outline" size={80} color="#B2BEC3" />
        <Text style={styles.statusText}>Please log in to view your cart.</Text>
        <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.replace("/(auth)/Login")}
          >
            <Text style={styles.actionButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={80} color="#FF6B6B" />
        <Text style={styles.statusText}>{error}</Text>
         <TouchableOpacity
            style={styles.actionButton}
            onPress={fetchCartItems}
          >
            <Text style={styles.actionButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Shopping Cart</Text>
        <View style={styles.headerButton} />
      </View>

      {cartItems.length === 0 ? (
        <View style={[styles.centerContent, { flex: 1 }]}>
          <Ionicons name="cart-outline" size={100} color="#4A4A4A" />
          <Text style={styles.statusText}>Your cart is wonderfully empty!</Text>
          <Text style={styles.subStatusText}>Time to fill it with amazing courses.</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(tabs)/courseListing")}
          >
            <Text style={styles.actionButtonText}>Browse Courses</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.cartList} contentContainerStyle={{ paddingBottom: 20 }}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  accessibilityLabel={`Image of ${item.name}`}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  <View style={styles.quantityControl}>
                    
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  style={styles.removeButton}
                  accessibilityLabel={`Remove ${item.name} from cart`}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.checkoutContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalText}>Total Amount</Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.push({
                pathname: "/payment",
                params: {
                  totalAmount: totalPrice.toFixed(2),
                  items: JSON.stringify(cartItems.map(cartItem => ({ productId: cartItem.productId, name: cartItem.name, quantity: cartItem.quantity, price: cartItem.price })))
                }
              })}
              disabled={cartItems.length === 0}
              accessibilityRole="button"
              accessibilityLabel="Proceed to checkout"
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
    backgroundColor: '#121212',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    marginBlock:40,
    marginBottom: 10,
  },
  headerButton: {
    padding: 5,
    width: 40,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusText: {
    fontSize: 18,
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  subStatusText: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#333333'
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-around',
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E0E0E0",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#8A2BE2",
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#4A4A4A',
    borderRadius: 20,
    marginHorizontal: 8,
  },
  itemQuantity: {
    fontSize: 16,
    color: "#E0E0E0",
    fontWeight: '500',
    minWidth: 20,
    textAlign: 'center'
  },
  removeButton: {
    padding: 10,
    marginLeft: 10,
  },
  checkoutContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: "#1E1E1E",
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  priceValue: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
    paddingTop: 12,
    marginTop: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  checkoutButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Cart;