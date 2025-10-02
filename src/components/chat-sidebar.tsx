"use client";

import { User as FirebaseUser } from "firebase/auth";
import { useRouter, usePathname, useParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, MessageSquarePlus, ChevronDown, BookCopy, LayoutDashboard } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getConversations } from "@/app/actions/chat";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";


type ChatSidebarProps = {
  user: FirebaseUser;
};

type ConversationTitle = {
    id: string;
    title: string;
}

export function ChatSidebar({ user }: ChatSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { toast } = useToast();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1');

  const [conversations, setConversations] = useState<ConversationTitle[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (user) {
        setLoadingHistory(true);
        getConversations(user.uid).then(result => {
            if(result.success && result.conversations) {
                setConversations(result.conversations);
            } else {
                console.error(result.error);
            }
            setLoadingHistory(false);
        })
    }
  }, [user, pathname]);


  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
      toast({ title: "Logged out successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred while logging out.",
      });
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  return (
    <aside className="w-72 flex-col border-r bg-card/80 p-4 hidden md:flex">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
            <Button asChild className="w-full justify-start gap-2" variant={pathname === '/chat/dashboard' ? 'secondary' : 'outline'}>
              <Link href="/chat/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild className="w-full justify-start gap-2" variant={pathname === '/chat' ? 'secondary' : 'default'}>
              <Link href="/chat">
                <MessageSquarePlus className="h-4 w-4" />
                New Chat
              </Link>
            </Button>
        </div>

        <nav className="mt-6">
          <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">History</h2>
          <div className="space-y-1">
            {loadingHistory ? (
                <>
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </>
            ) : conversations.length > 0 ? (
                conversations.map(conv => (
                    <Button
                        key={conv.id}
                        asChild
                        variant="ghost"
                        className={cn("w-full justify-start gap-2 truncate", params.id === conv.id && "bg-muted hover:bg-muted")}
                    >
                        <Link href={`/chat/${conv.id}`}>
                            <BookCopy className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{conv.title}</span>
                        </Link>
                    </Button>
                ))
            ) : (
                <p className="text-xs text-muted-foreground text-center p-4">No chat history yet.</p>
            )}
          </div>
        </nav>
      </div>

      <div className="mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-auto p-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  {user.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                  ) : userAvatar ? (
                    <Image src={userAvatar.imageUrl} alt={userAvatar.description} width={36} height={36} />
                  ) : null }
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.displayName || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
