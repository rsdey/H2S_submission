"use client";

import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/layout/Sidebar";
import ChatContainer from "../components/chat/ChatContainer";
import LandingPage from "../components/features/LandingPage";
import { Loader2 } from "lucide-react";

export default function Home() {
  // Pass false to useAuth so it doesn't redirect unauthenticated users
  const { user, loading } = useAuth(false);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-primary">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
      </div>
    );
  }

  // If user is not logged in, show the landing page
  if (!user) {
    return <LandingPage />;
  }

  // If user is logged in, show the chat app
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar userId={user.uid} />
      <main className="flex-1 overflow-hidden relative">
        <ChatContainer userId={user.uid} />
      </main>
    </div>
  );
}
