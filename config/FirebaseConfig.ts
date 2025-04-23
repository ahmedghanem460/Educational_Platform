// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsYrZ0VRmM_qZfzPqw3RGvX_-uksZkZwQ",
  authDomain: "cs303-9b4fb.firebaseapp.com",
  projectId: "cs303-9b4fb",
  storageBucket: "cs303-9b4fb.appspot.com", 
  messagingSenderId: "499619527846",
  appId: "1:499619527846:web:6a2d56ae954a745a024867",
  measurementId: "G-Y06EVXBRCK"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);