
"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { sendMessage } from "@/app/actions/chat";
import type { Message } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ShadowLinkLogo } from "./icons";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const { user, db } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const router = useRouter();

  const conversationId = params.id as string | undefined;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isAiThinking]);

  useEffect(() => {
    if (conversationId && db) {
      setIsAiThinking(true);
      const unsub = onSnapshot(doc(db, "conversations", conversationId), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const currentMessages = data.messages || [];
          setMessages(currentMessages);

          // Check if the last message is from the user
          if (currentMessages.length > 0 && currentMessages[currentMessages.length - 1].sender === 'user') {
            setIsAiThinking(true);
          } else {
            setIsAiThinking(false);
          }
        } else {
          toast({ variant: 'destructive', title: 'Error', description: 'Conversation not found.' });
          router.push('/chat/dashboard');
        }
      });
      return () => unsub();
    } else {
        setMessages([]);
        setIsAiThinking(false);
    }
  }, [conversationId, router, toast, db]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isSending) return;

    const tempUserMessageId = Date.now().toString();
    const userMessage: Message = {
      id: tempUserMessageId,
      text: input,
      sender: "user",
      createdAt: Timestamp.now(),
    };
    
    setIsSending(true);
    if (isNewChat) {
      setMessages((prev) => [...prev, userMessage]);
      setIsAiThinking(true);
    }
    
    const currentInput = input;
    setInput("");
    
    try {
      const result = await sendMessage(user.uid, conversationId || null, currentInput);

      if (result.success && result.conversationId) {
        if (!conversationId) {
          router.push(`/chat/${result.conversationId}`);
        }
      } else {
        throw new Error(result.error || "Failed to send message.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      });
      // Revert optimistic update only if it was a new chat
      if(isNewChat) {
        setMessages(prev => prev.filter(m => m.id !== tempUserMessageId));
        setIsAiThinking(false);
      }
    } finally {
        setIsSending(false);
    }
  };
  
  const isNewChat = !conversationId;

  return (
    <div className="flex-1 flex flex-col h-full p-4 gap-4">
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto pr-4">
        {messages.length === 0 && isNewChat ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <ShadowLinkLogo className="h-16 w-16 text-muted-foreground/50" />
            <h2 className="mt-4 text-2xl font-semibold font-headline">
              Welcome to ShadowLink
            </h2>
            <p className="mt-2 text-muted-foreground">
              Start a conversation to begin training your digital self.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex items-start gap-4 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarFallback className="bg-transparent"><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-md rounded-2xl p-3 px-4 shadow-md ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                 {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    {user?.photoURL && <AvatarImage src={user.photoURL} />}
                    <AvatarFallback className="bg-accent text-accent-foreground"><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isAiThinking && (
                 <div className="flex items-start gap-4">
                     <Avatar className="h-8 w-8 border-2 border-primary">
                        <AvatarFallback className="bg-transparent"><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-md rounded-2xl p-3 px-4 shadow-md bg-muted rounded-bl-none">
                        <div className="flex items-center space-x-2">
                           <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                           <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                           <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
                        </div>
                    </div>
                </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Card className="p-2 glass-card">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message your AI..."
              className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={isSending}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isSending}>
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
