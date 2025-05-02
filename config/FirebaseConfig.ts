// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsYrZ0VRmM_qZfzPqw3RGvX_-uksZkZwQ",
  authDomain: "cs303-9b4fb.firebaseapp.com",
  projectId: "cs303-9b4fb",
  storageBucket: "cs303-9b4fb.appspot.com", // You already have this
  messagingSenderId: "499619527846",
  appId: "1:499619527846:web:6a2d56ae954a745a024867",
  measurementId: "G-Y06EVXBRCK"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP); // Add this export