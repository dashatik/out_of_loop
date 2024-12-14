"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Emoji3D = dynamic(() => import("./emoji-3d"), { ssr: false }); // Dynamically import 3D logos

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/chat");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-gray-900 dark:to-black px-4">
      {/* 3D Animation Section */}
      <motion.div
        className="w-full lg:w-1/2 h-96 sm:h-64 flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Emoji3D />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-6">
          Why waste time arguing with ChatGPT?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          This app is designed with <strong>integrated perfect prompts</strong>, so you can save time and avoid the hustle
          of arguing over specifics.
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
          "Forget arguing. Forget explaining. Just win."
        </p>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-600">
          All rights reserved by Daria T.
        </p>
      </motion.div>

      {/* Content Section */}
      <motion.div
        className="w-full lg:w-1/2 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h1 className="text-5xl font-extrabold mb-6 text-gray-800 dark:text-white">
          Out of <span className="text-indigo-600">Loop</span>
        </h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
          {isSignup
            ? "Experience the future of AI interaction."
            : "Unlock a whole new level of ChatGPT magic."}
        </p>

        {/* Form */}
        <form
          onSubmit={handleAuth}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md space-y-6"
        >
          {error && (
            <motion.div
              className="text-red-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:ring focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:ring focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </motion.button>
        </form>

        {/* Toggle Signup/Login */}
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-indigo-500 hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
