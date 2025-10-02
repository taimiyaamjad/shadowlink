"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ChatSidebar } from "@/components/chat-sidebar";
import { Loader2 } from "lucide-react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (!loading && user && pathname === '/chat') {
      router.replace('/chat/dashboard');
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar user={user} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
