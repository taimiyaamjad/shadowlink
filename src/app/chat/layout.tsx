"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ChatSidebar } from "@/components/chat-sidebar";
import { Loader2 } from "lucide-react";
import { ChatArea } from "@/components/chat-area";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }
  
  const isChatPage = pathname === '/chat';

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar user={user} />
      <main className="flex-1 flex flex-col">
        {isChatPage ? <ChatArea /> : children}
      </main>
    </div>
  );
}
