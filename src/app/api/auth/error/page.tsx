"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = {
    CredentialsSignin: "Invalid username or password. Please try again.",
    default: "An unexpected error occurred. Please try again.",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">Authentication Error</h1>
      <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
        {errorMessage[error as keyof typeof errorMessage] || errorMessage.default}
      </p>
      <Link
        href="/"
        className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Go Back to Login
      </Link>
    </div>
  );
}
