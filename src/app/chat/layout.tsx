"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ChatSidebar } from "@/components/chat-sidebar";
import { Loader2 } from "lucide-react";
import { app } from "@/lib/firebase"; // Import app

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || !app) { // Check for app initialization
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }
  
  // By confirming `app` is initialized before rendering, we ensure children
  // components like ChatSidebar will have a ready Firebase instance.
  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar user={user} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
