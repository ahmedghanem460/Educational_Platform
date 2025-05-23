// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add this import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALAqGC4Xx_1Mf-vHY-UEO23_QYQn_NQU4",
  authDomain: "rnauthtest-f3e48.firebaseapp.com",
  projectId: "rnauthtest-f3e48",
  storageBucket: "rnauthtest-f3e48.firebasestorage.app",
  messagingSenderId: "221064979760",
  appId: "1:221064979760:web:3440b3f82f222cffe2d4f5",
  measurementId: "G-N0K7YNZ7SV"
};
// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP); // Add this export