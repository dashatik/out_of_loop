"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import ChatLayout from "@/components/chat-layout";
import { auth } from "@/lib/firebase";

export default function ChatPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/"); // Redirect to login if not authenticated
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col">
      <ChatLayout />
    </main>
  );
}
