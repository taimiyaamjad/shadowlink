import type { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  createdAt: Timestamp;
}

export interface Conversation {
  id: string;
  userId: string;
  createdAt: Timestamp;
  lastMessageAt: Timestamp;
  summary?: string;
  messages: Message[];
}

export interface UserPersonality {
  userId: string;
  profile: string;
  writingStyle: string;
  tone: string;
  responsePatterns: string;
}
