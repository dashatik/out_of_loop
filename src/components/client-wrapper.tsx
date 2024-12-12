"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth"; // Correctly import the User type from Firebase

interface AuthContextType {
  user: User | null; // Modular Firebase User type
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);

  // Ensure user is either null or a valid User object
  const normalizedUser = user || null;

  return (
    <AuthContext.Provider value={{ user: normalizedUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
