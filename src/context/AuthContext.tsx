// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "../firebase"; // Adjust path to where you put firebase.ts

// Define what the context looks like
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// The Provider component that wraps your app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes (logs in automatically on refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // const signIn = async () => {
  //   const provider = new GoogleAuthProvider();
  //   await signInWithPopup(auth, provider);
  // };
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log("Attempting to open Google Popup..."); // Debug 1
      await signInWithPopup(auth, provider);
      console.log("Success! User signed in."); // Debug 2
    } catch (error: any) {
      console.error("FIREBASE ERROR:", error.code, error.message); // <--- THIS IS WHAT WE NEED
      alert("Login Failed: " + error.message); // Visual feedback
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth easily
export const useAuth = () => useContext(AuthContext);
