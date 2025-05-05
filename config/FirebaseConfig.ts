// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add this import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgDrRXdPTJfjPrO7m6GfJeSSafSFuTfIE",
  authDomain: "eduplt.firebaseapp.com",
  projectId: "eduplt",
  storageBucket: "eduplt.firebasestorage.app",
  messagingSenderId: "903410685927",
  appId: "1:903410685927:web:835e97b410d6136c048f42",
  measurementId: "G-WSD0LCB7EB"
};
// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP); // Add this export