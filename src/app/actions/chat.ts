"use server";

import {
  doc,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  getDocs,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import type { Message } from "@/lib/types";

// IMPORTANT: The following GenAI flow imports are available because they
// have been pre-built by another process.
// You can use them but MUST NOT modify them.
import { generateInitialPersonality } from "@/ai/flows/generate-initial-personality";
import { analyzeConversationPatterns } from "@/ai/flows/analyze-conversation-patterns";
import { summarizeConversationHistory } from "@/ai/flows/summarize-conversation-history";
import { generateChatResponse } from "@/ai/flows/generate-chat-response";

/**
 * Note on Security:
 * In a production application, you would need to verify the user's identity
 * on the server. This is typically done by passing a Firebase ID token from the
 * client to the server action, which is then verified using the Firebase Admin SDK.
 * The `uid` is passed directly here for simplicity due to project constraints.
 */
export async function sendMessage(
  uid: string,
  conversationId: string, // This will be used to fetch conversation history
  messageText: string,
  currentMessages: Message[]
) {
  if (!uid) {
    return { success: false, error: "User is not authenticated." };
  }
  if (!messageText.trim()) {
    return { success: false, error: "Message cannot be empty." };
  }

  try {
    const conversationHistory = currentMessages
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join("\n");

    const aiResponse = await generateChatResponse({
      conversationHistory,
      latestMessage: messageText,
    });
    
    const aiResponseText = aiResponse.response;

    // This is where you would persist the messages to Firestore
    // For now, we are just returning the AI response to the client
    // which manages the message list in its state.
    
    // In a real app, conversation management would be more robust.
    // For now, we are just simulating the interaction.
    // const conversationRef = doc(db, 'conversations', conversationId);
    
    const userMessage = {
        text: messageText,
        sender: 'user',
        createdAt: serverTimestamp()
    };
    
    // await updateDoc(conversationRef, { messages: arrayUnion(userMessage) });

    const aiMessage = {
        text: aiResponseText,
        sender: 'ai',
        createdAt: serverTimestamp()
    };

    // await updateDoc(conversationRef, { messages: arrayUnion(aiMessage) });

    // Since we aren't using a real conversationId yet, we can't revalidate a specific path
    // revalidatePath(`/chat/${conversationId}`);

    return { success: true, aiResponse: aiResponseText };
  } catch (error) {
    console.error("Error sending message:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
