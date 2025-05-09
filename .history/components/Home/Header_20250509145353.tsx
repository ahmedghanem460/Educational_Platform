// import { View, Text, Platform, Pressable } from 'react-native'
// import React, { useContext, useState } from 'react'
// import UserDetailsContext from '../../context/UserDetailContext'
// import Ionicons from '@expo/vector-icons/Ionicons'
// import { useFocusEffect } from 'expo-router';
// import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';

// const Header = () => {
//   const { userDetails } = useContext(UserDetailsContext);
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const fetchUserData = async () => {
//       const currentUser = FIREBASE_AUTH.currentUser;
//       if (currentUser) {
//         setUser(currentUser);
//         try {
//           const userRef = doc(FIREBASE_DB, 'users', currentUser.uid);
//           const userDoc = await getDoc(userRef);
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setUser(userData);
//           } else {
//             console.log("No such document!");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       } else {
//         setLoading(false);
//       }
//     };
  
//     useFocusEffect(
//       React.useCallback(() => {
//         fetchUserData();
//       }, [])
//     );

//   return (
//     <View
//       style={{
//         paddingTop: Platform.OS === 'ios' ? 20 : 25,
//         paddingBottom: 20,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//       }}
//     >
//       <View>
//         <Text
//           style={{
//             fontFamily: 'outfit-bold',
//             fontSize: 25,
//             color: 'white',
//           }}
//         >
//           Hello, {userDetails?.name || user?.displayName}
//         </Text>
//         <Text
//           style={{
//             fontFamily: 'outfit-bold',
//             fontSize: 17,
//             color: 'white',
//           }}
//         >
//           Let's Get Started
//         </Text>
//       </View>

//       <Pressable style={{ paddingRight: 10 }}>
//         <Ionicons name="settings-outline" size={24} color="white" />
//       </Pressable>
//     </View>
//   );
// };

// export default Header;
import { View, Text, Platform, Pressable } from 'react-native';
import React, { useContext, useState, useCallback } from 'react'; // Added useCallback
import UserDetailsContext from '../../context/UserDetailContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const { userDetails } = useContext(UserDetailsContext);
  // 'userFromFirebase' will store either the Auth user object or Firestore user data
  const [userFromFirebase, setUserFromFirebase] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Start with loading true

  const fetchUserData = useCallback(async () => { // Wrap in useCallback for useFocusEffect
    setLoading(true); // Set loading true at the start of fetch
    const currentUser = FIREBASE_AUTH.currentUser;

    if (currentUser) {
      // Initially set userFromFirebase to the Auth user.
      // This provides a fallback if Firestore fetch fails or doc doesn't exist.
      setUserFromFirebase(currentUser);
      try {
        const userRef = doc(FIREBASE_DB, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const firestoreUserData = userDoc.data();
          // If Firestore data exists, it's usually more complete/preferred.
          // It might contain 'name' or 'displayName' or other fields.
          setUserFromFirebase(firestoreUserData);
        } else {
          // This is where your log comes from.
          // userFromFirebase remains as currentUser (Auth object)
          console.log("No such document in Firestore for user:", currentUser.uid);
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    } else {
      setUserFromFirebase(null); 
    }
    setLoading(false); 
  }, []); 

  useFocusEffect(
    useCallback(() => { 
      fetchUserData();
    }, [fetchUserData]) 
  );

  let displayName = "User"; 
  if (loading) {
    displayName = "...";
  } else if (userDetails?.name) {
    displayName = userDetails.name;
  } else if (userFromFirebase) {
    // Check for 'name' (common in Firestore custom objects) then 'displayName' (common in Auth objects)
    displayName = userFromFirebase.name || userFromFirebase.displayName || "User";
  }

  return (
    <View
      style={{
        paddingTop: Platform.OS === 'ios' ? 20 : 25,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 25,
            color: 'white',
          }}
        >
          Hello, {displayName}
        </Text>
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 17,
            color: 'white',
          }}
        >
          Let's Get Started
        </Text>
      </View>

      <Pressable style={{ paddingRight: 10 }}>
        <Ionicons name="settings-outline" size={24} color="white" />
      </Pressable>
    </View>
  );
};

export default Header;