// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// PASTE YOUR CONFIG OBJECT FROM THE FIREBASE CONSOLE HERE
const firebaseConfig = {
  apiKey: "AIzaSyDAJbsefCVHbTihSDp1LkaYvQa3FZYgsOs",
  authDomain: "graduwate-66c90.firebaseapp.com",
  projectId: "graduwate-66c90",
  storageBucket: "graduwate-66c90.firebasestorage.app",
  messagingSenderId: "824063694452",
  appId: "1:824063694452:web:4d64e185e7af76bf9d6321",
  measurementId: "G-CGKCCZ3Y0V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth instance and provider so you can use them elsewhere
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
