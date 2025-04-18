// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyD3d8InILnJ1mvdkL5N-SDRgL0R7tkNyDA",
  authDomain: "ghanem-162c9.firebaseapp.com",
  projectId: "ghanem-162c9",
  storageBucket: "ghanem-162c9.firebasestorage.app",
  messagingSenderId: "916853018652",
  appId: "1:916853018652:web:4c9245c3f8932b19d18fd9",
  measurementId: "G-BWTJDGE4L0"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
const analytics = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);