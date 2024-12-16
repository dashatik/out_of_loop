"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import IntroPage from "@/components/intro-page";
import LandingPage from "@/components/landing-page";
import { useRouter, usePathname } from "next/navigation";

export default function PageRouter({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // Track user authentication
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state
      setLoading(false);

      if (pathname === "/landing-page") {
        if (currentUser) {
          router.push("/chat"); // Redirect authenticated users to chat
        }
      } else if (pathname === "/chat" && !currentUser) {
        router.push("/landing-page"); // Redirect unauthenticated users to landing-page
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    ); // Prevent rendering during auth state loading
  }

  if (pathname === "/") {
    return <IntroPage />; // Display IntroPage for root path
  }

  if (pathname === "/landing-page" && !user) {
    return <LandingPage />; // Show LandingPage for unauthenticated users
  }

  return <>{children}</>; // Render other content if authenticated
}

