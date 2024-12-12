"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import LandingPage from "@/components/landing-page";
import { useRouter, usePathname } from "next/navigation";

export default function PageRouter({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // Correctly typed
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Updates user state with User or null
      setLoading(false);

      if (!currentUser && pathname !== "/") {
        router.push("/"); // Redirect unauthenticated users to the landing page
      } else if (currentUser && pathname === "/") {
        router.push("/chat"); // Redirect authenticated users to chat
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

  if (!user && pathname === "/") {
    return <LandingPage />;
  }

  return <>{children}</>;
}

