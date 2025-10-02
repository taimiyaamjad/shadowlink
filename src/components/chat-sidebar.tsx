"use client";

import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
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
import { LogOut, MessageSquarePlus, ChevronDown, Loader2, BookCopy } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

type ChatSidebarProps = {
  user: FirebaseUser;
};

export function ChatSidebar({ user }: ChatSidebarProps) {
  const router = useRouter();
  const { toast } = useToast();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1');

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
        <Button className="w-full justify-between" variant="outline">
          New Chat <MessageSquarePlus className="h-4 w-4" />
        </Button>

        <nav className="mt-6">
          <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">History</h2>
          <div className="space-y-2">
            {/* Placeholder for conversation history list */}
            <div className="flex items-center gap-2 p-2 rounded-md animate-pulse bg-muted/50">
                <BookCopy className="h-4 w-4 text-muted-foreground" />
                <div className="w-4/5 h-4 bg-muted-foreground/30 rounded"></div>
            </div>
             <div className="flex items-center gap-2 p-2 rounded-md animate-pulse bg-muted/50">
                <BookCopy className="h-4 w-4 text-muted-foreground" />
                <div className="w-3/5 h-4 bg-muted-foreground/30 rounded"></div>
            </div>
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
                <div className="text-left">
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
