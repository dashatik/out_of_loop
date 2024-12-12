"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification 
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      if (isSignup) {
        // Sign up logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user); // Send verification email
        setSuccessMessage("Verification email sent. Please verify your email before logging in.");
      } else {
        // Login logic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        if (!userCredential.user.emailVerified) {
          throw new Error("Email not verified. Please check your inbox.");
        }

        router.push("/chat"); // Redirect to chat on success
      }
    } catch (err: any) {
      setError(err.message); // Display error message
    }
  };

  const resendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setSuccessMessage("A new verification email has been sent.");
      } else {
        setError("No user is currently signed in.");
      }
    } catch (err: any) {
      setError("Failed to resend verification email. Try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
        {isSignup ? "Sign Up" : "Login"} to Daria's AI Chat App
      </h1>
      <form
        onSubmit={handleAuth}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:ring focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:ring focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>
      {isSignup && (
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          <button onClick={resendVerification} className="text-blue-500 hover:underline">
            Resend Verification Email
          </button>
        </p>
      )}
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsSignup(!isSignup)}
          className="text-blue-500 hover:underline"
        >
          {isSignup ? "Login" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}
