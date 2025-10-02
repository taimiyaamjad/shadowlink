"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { getFirebaseInstances } from "@/lib/firebase";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  firebaseInitialized: boolean;
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseInstances, setFirebaseInstances] = useState<{
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
  } | null>(null);

  useEffect(() => {
    const { app, auth, db } = getFirebaseInstances();
    setFirebaseInstances({ app, auth, db });

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const firebaseInitialized = !!firebaseInstances;

  return (
    <AuthContext.Provider value={{ 
        user, 
        loading, 
        firebaseInitialized,
        app: firebaseInstances?.app || null,
        auth: firebaseInstances?.auth || null,
        db: firebaseInstances?.db || null,
     }}>
      {children}
      <Toaster />
    </AuthContext.Provider>
  );
}
