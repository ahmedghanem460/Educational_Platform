import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyALAqGC4Xx_1Mf-vHY-UEO23_QYQn_NQU4",
  authDomain: "rnauthtest-f3e48.firebaseapp.com",
  projectId: "rnauthtest-f3e48",
  storageBucket: "rnauthtest-f3e48.firebasestorage.app",
  messagingSenderId: "221064979760",
  appId: "1:221064979760:web:3440b3f82f222cffe2d4f5",
  
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
