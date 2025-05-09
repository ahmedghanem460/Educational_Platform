// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
// import { doc, getDoc } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_DB } from '../config/FirebaseConfig';
// import UserDetailsContext from '../context/UserDetailContext';

// const Cart = () => {
//   const { userDetails, setUserDetails } = useContext(UserDetailsContext);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = FIREBASE_AUTH.currentUser;
//       if (user) {
//         const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
//         const docSnap = await getDoc(userDocRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setUserDetails(data as any); // safe now since interface matches
//         }
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }
//   console.log('User Details:', userDetails);
//   if (!userDetails) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.loginPrompt}>Please log in to view your cart.</Text>
//       </View>
//     );
//   }

//   const cartItems = userDetails.cartItems || [];

//   const handleRemoveFromCart = (cartItemId: string) => {
//     console.log('Removing item:', cartItemId);
//     // TODO: Remove logic (Firebase update)
//   };

//   const handleCheckout = () => {
//     console.log('Proceeding to checkout');
//     // TODO: Checkout navigation
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Cart</Text>

//       {cartItems.length === 0 ? (
//         <Text style={styles.emptyCartText}>Your cart is empty.</Text>
//       ) : (
//         <FlatList
//           data={cartItems}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.cartItem}>
//               <Image source={{ uri: item.image }} style={styles.cartItemImage} />
//               <View style={styles.cartItemDetails}>
//                 <Text style={styles.cartItemTitle}>{item.name}</Text>
//                 <Text style={styles.cartItemPrice}>${item.price}</Text>
//                 <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
//               </View>
//               <TouchableOpacity
//                 style={styles.removeButton}
//                 onPress={() => handleRemoveFromCart(item.id)}
//               >
//                 <Text style={styles.removeButtonText}>Remove</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}

//       {cartItems.length > 0 && (
//         <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
//           <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F6FA",
//     marginBlock:40,
//     marginBottom: 10,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 10,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E8E8E8',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   emptyCartText: {
//     fontSize: 16,
//     color: '#888',
//     marginTop: 10,
//   },
//   cartItem: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#f1f1f1',
//     borderRadius: 10,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   cartItemImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 10,
//   },
//   cartItemDetails: {
//     flex: 1,
//     marginLeft: 15,
//   },
//   cartItemTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cartItemPrice: {
//     fontSize: 14,
//     color: '#555',
//   },
//   cartItemQuantity: {
//     fontSize: 14,
//     color: '#888',
//   },
//   removeButton: {
//     backgroundColor: '#ff0000',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   removeButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   checkoutButton: {
//     backgroundColor: '#28a745',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   checkoutButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   loginPrompt: {
//     fontSize: 16,
//     color: '#888',
//   },
// });

// export default Cart;
// import React, { useEffect, useState } from "react";
// import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
// import { useRouter } from "expo-router";
// import { AntDesign, Ionicons } from '@expo/vector-icons';
// import { FIREBASE_DB } from "../config/FirebaseConfig";
// import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
// import { doc, deleteDoc } from 'firebase/firestore';

// type CartItem = {
//   id: string;
//   name: string;
//   price: string; // Ensure this is a string from Firestore
//   image: string;
//   quantity: number;
// };

// const Cart = () => {
//   const router = useRouter();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);  // State to hold cart items
//   const [totalPrice, setTotalPrice] = useState<number>(0);  // State to hold total price
//   const [loading, setLoading] = useState<boolean>(true);  // State to manage loading state
//   const [error, setError] = useState<string | null>(null);  // Error state for fetch failures

//   // Fetch cart items from Firestore
//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         setLoading(true);
//         const cartCollection = collection(FIREBASE_DB, "cart");
//         const cartSnapshot = await getDocs(cartCollection);

//         const cartData: CartItem[] = cartSnapshot.docs.map(doc => ({
//           id: doc.id,  // document id
//           name: doc.data().name,
//           price: doc.data().price,
//           image: doc.data().image,
//           quantity: doc.data().quantity,
//         }));

//         setCartItems(cartData);
//         calculateTotalPrice(cartData);  // Calculate total price after fetching cart data
//         setLoading(false);
//       } catch (error) {
//         setLoading(false);
//         setError("Error fetching cart items.");
//         console.error("Error fetching cart items: ", error);
//       }
//     };

//     fetchCartItems();
//   }, []);

//   // Calculate total price of items in the cart
//   const calculateTotalPrice = (cartData: CartItem[]) => {
//     const total = cartData.reduce((acc, item) => {
//       // Initialize variables outside the if statement
//       let price = 0;
//       let quantity = 0;

//       if (item && item.price !== undefined) {
//         // Handle price - convert to string first in case it's already a number
//         price = parseFloat(String(item.price).replace(/[^0-9.-]+/g, ''));

//         // Handle quantity - ensure it's a number and default to 1 if not specified
//         quantity = typeof item.quantity === 'number' ? item.quantity :
//           (parseInt(String(item.quantity), 10) || 1);

//         console.log(`Item: ${item.name}, Price: ${price}, Quantity: ${quantity}`);
//         console.log('item.price', item.price);

//         // Only add to accumulator if both values are valid numbers
//         if (!isNaN(price) && !isNaN(quantity)) {
//           return acc + (price * quantity);
//         }
//       } else {
//         console.log('Skipping item with undefined price:', item);
//       }

//       return acc;  // Return unchanged accumulator for invalid items
//     }, 0);

//     console.log(`Total Price: ${total}`);
//     setTotalPrice(total);
//   };

//   // Remove item from cart (to be implemented in Firestore)
//   const removeFromCart = async (id: string) => {
//     try {
//       // Reference to the specific document you want to delete
//       const itemRef = doc(FIREBASE_DB, "cart", id);  // 'cart' is your collection name, 'id' is the document ID

//       // Delete the document from Firestore
//       await deleteDoc(itemRef);

//       // Update local state after deletion
//       setCartItems(prevItems => {
//         const updatedItems = prevItems.filter(item => item.id !== id);
//         calculateTotalPrice(updatedItems);  // Recalculate total price
//         return updatedItems;
//       });

//       alert(`Item with ID ${id} removed from cart`);
//     } catch (error) {
//       console.error("Error removing item from cart: ", error);
//       alert("There was an error removing the item from the cart.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#6C5CE7" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container]}>
//       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#1e1e1e' }}>
//         <AntDesign name="arrowleft" size={24} color="#fff" style={{ position: 'absolute', top: 40, left: 15 }} onPress={() => router.back()} />
//         {/* <Text style={styles.headerTitle}>Shopping Cart</Text> */}
//         {/* <Text style={styles.headerTitle}>Your Cart</Text>
//         <Ionicons name="cart-outline" size={24} color="#fff" /> */}
//       </View>

//       {cartItems.length === 0 ? (
//         <View style={styles.emptyCart}>
//           <Ionicons name="cart-outline" size={80} color="#B2BEC3" />
//           <Text style={styles.emptyCartText}>Your cart is empty</Text>
//           <TouchableOpacity
//             style={styles.continueShoppingButton}
//             onPress={() => router.push("/(tabs)/courseListing")}
//           >
//             <Text style={styles.continueShoppingText}>Browse Courses</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           <ScrollView style={styles.cartList}>
//             {cartItems.map((item) => (
//               <View key={item.id} style={styles.cartItem}>
//                 <Image
//                   source={{ uri: item.image }}
//                   style={styles.itemImage}
//                 />
//                 <View style={styles.itemInfo}>
//                   <Text style={styles.itemName}>{item.name}</Text>
//                   <Text style={styles.itemPrice}>${item.price}</Text>
//                   <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
//                 </View>
//                 <TouchableOpacity
//                   onPress={() => removeFromCart(item.id)}
//                   style={styles.removeButton}
//                 >
//                   <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>

//           <View style={styles.checkoutContainer}>
//             <View style={styles.priceBreakdown}>
//               <View style={styles.priceRow}>
//                 <Text style={styles.priceLabel}>Subtotal</Text>
//                 <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
//               </View>
//               <View style={[styles.priceRow, styles.totalRow]}>
//                 <Text style={styles.totalText}>Total</Text>
//                 <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
//               </View>
//             </View>
//             <TouchableOpacity
//               style={styles.checkoutButton}
//               onPress={() => router.push({
//                 pathname: "/payment",
//                 params: {
//                   totalAmount: totalPrice,
//                   items: JSON.stringify(cartItems)
//                 }
//               })}
//             >
//               <Text style={styles.checkoutText}>Proceed to Checkout</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1e1e1e',
//   },
//   // header: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   justifyContent: 'space-between',
//   //   padding: 20,
//   //   backgroundColor: '#FFFFFF',
//   //   borderBottomWidth: 1,
//   //   borderBottomColor: '#E8E8E8',
//   //   elevation: 2,
//   //   shadowColor: '#000',
//   //   shadowOffset: { width: 0, height: 2 },
//   //   shadowOpacity: 0.1,
//   //   shadowRadius: 3,
//   // },
//   // backButton: {
//   //   width: 40,
//   //   height: 40,
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   //   borderRadius: 20,
//   //   backgroundColor: '#F5F6FA',
//   // },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2D3436',
//   },
//   emptyCart: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyCartText: {
//     fontSize: 18,
//     color: '#636E72',
//     marginTop: 16,
//     marginBottom: 24,
//     fontWeight: '500',
//   },
//   continueShoppingButton: {
//     backgroundColor: '#6C5CE7',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: '#6C5CE7',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   continueShoppingText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   cartList: {
//     padding: 16,
//   },
//   cartItem: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     marginBottom: 16,
//     borderRadius: 16,
//     padding: 16,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   itemImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 12,
//     marginRight: 16,
//   },
//   itemInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#2D3436",
//     marginBottom: 4,
//   },
//   itemPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#6C5CE7",
//   },
//   itemQuantity: {
//     fontSize: 14,
//     color: "#636E72",
//   },
//   removeButton: {
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 8,
//   },
//   checkoutContainer: {
//     padding: 20,
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   priceBreakdown: {
//     marginBottom: 20,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   priceLabel: {
//     fontSize: 16,
//     color: '#636E72',
//     fontWeight: '500',
//   },
//   priceValue: {
//     fontSize: 16,
//     color: '#2D3436',
//     fontWeight: '500',
//   },
//   totalRow: {
//     borderTopWidth: 1,
//     borderTopColor: '#E8E8E8',
//     paddingTop: 12,
//     marginTop: 8,
//   },
//   totalText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2D3436',
//   },
//   totalPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#6C5CE7',
//   },
//   checkoutButton: {
//     backgroundColor: '#6C5CE7',
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#6C5CE7',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   checkoutText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   errorText: {
//     fontSize: 18,
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default Cart;

import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert, Platform, ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FIREBASE_DB, FIREBASE_AUTH } from "../config/FirebaseConfig"; 
import { collection, getDocs, doc, deleteDoc, updateDoc, runTransaction } from 'firebase/firestore'; 
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
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const getCartCollectionRef = useCallback(() => {
    if (!currentUser) return null;
    return collection(FIREBASE_DB, "users", currentUser.uid, "cart");
  }, [currentUser]);

  const fetchCartItems = useCallback(async () => {
    const cartCollection = getCartCollectionRef();
    if (!cartCollection) {
      setLoading(false);
      // setError("Please log in to view your cart."); // Handled by UI check
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
          // Ensure price is a number. If it's a string from Firestore, parse it.
          price: typeof data.price === 'string' ? parseFloat(data.price.replace(/[^0-9.]/g, '')) : (data.price || 0),
          image: data.image || 'default_image_url_here', // Provide a fallback
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
      setCartItems([]); // Clear cart if user logs out
      setLoading(false);
    }
  }, [currentUser, fetchCartItems]);


  // Calculate total price whenever cartItems change
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.price || 0; // Default to 0 if price is undefined/NaN
      const quantity = item.quantity || 1; // Default to 1 if quantity is undefined
      return acc + (price * quantity);
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) { // Don't allow quantity less than 1, remove instead
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
            onPress={() => router.replace("/(auth)/Login")} // Adjust to your login route
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
            onPress={fetchCartItems} // Retry fetching
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
        <View style={styles.headerButton} /> {/* Spacer */}
      </View>

      {cartItems.length === 0 ? (
        <View style={[styles.centerContent, { flex: 1 }]}>
          <Ionicons name="cart-outline" size={100} color="#4A4A4A" />
          <Text style={styles.statusText}>Your cart is wonderfully empty!</Text>
          <Text style={styles.subStatusText}>Time to fill it with amazing courses.</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(tabs)/courseListing")} // Adjust to your courses route
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
                    <TouchableOpacity onPress={() => updateItemQuantity(item.id, item.quantity - 1)} style={styles.quantityButton} accessibilityLabel="Decrease quantity">
                      <AntDesign name="minus" size={18} color="#8A2BE2" />
                    </TouchableOpacity>
                    <Text style={styles.itemQuantity}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateItemQuantity(item.id, item.quantity + 1)} style={styles.quantityButton} accessibilityLabel="Increase quantity">
                      <AntDesign name="plus" size={18} color="#8A2BE2" />
                    </TouchableOpacity>
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
            {/* Add more rows for discounts, taxes if needed */}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalText}>Total Amount</Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.push({
                pathname: "/payment", // Ensure this route exists
                params: {
                  totalAmount: totalPrice.toFixed(2), // Send as string for safety
                  items: JSON.stringify(cartItems.map(item => ({ productId: item.productId, name: item.name, quantity: item.quantity, price: item.price }))) // Send relevant data
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
    backgroundColor: '#121212', // Dark background
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
    paddingTop: Platform.OS === 'android' ? 40 : 20, // Adjust for status bar
    backgroundColor: '#1E1E1E', // Slightly lighter dark for header
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerButton: {
    padding: 5,
    width: 40, // To balance the title
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
    backgroundColor: '#8A2BE2', // A vibrant purple
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25, // More rounded
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
    flex: 1, // Ensure ScrollView takes available space
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
    backgroundColor: '#333333' // Placeholder bg
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-around', // Distribute content vertically
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
    color: "#8A2BE2", // Theme color for price
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
    borderRadius: 20, // Circular buttons
    marginHorizontal: 8,
  },
  itemQuantity: {
    fontSize: 16,
    color: "#E0E0E0",
    fontWeight: '500',
    minWidth: 20, // Ensure number doesn't jump around
    textAlign: 'center'
  },
  removeButton: {
    padding: 10, // Easier to tap
    marginLeft: 10,
  },
  checkoutContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20, // Safe area for bottom
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
    color: '#8A2BE2', // Theme color
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