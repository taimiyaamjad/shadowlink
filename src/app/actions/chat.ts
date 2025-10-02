
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
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseInstances } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import type { Message, Conversation } from "@/lib/types";

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
  conversationId: string | null,
  messageText: string
) {
  if (!uid) {
    return { success: false, error: "User is not authenticated." };
  }
  if (!messageText.trim()) {
    return { success: false, error: "Message cannot be empty." };
  }
  
  const { db } = getFirebaseInstances();
  if (!db) {
    return { success: false, error: "Database is not initialized." };
  }


  try {
    let currentConversationId = conversationId;
    let conversationHistory = "";
    
    // If we have a conversationId, fetch it. Otherwise, we'll create a new one.
    if (currentConversationId) {
      const convDoc = await getDoc(doc(db, "conversations", currentConversationId));
      if (convDoc.exists()) {
        const conversation = convDoc.data() as Conversation;
        conversationHistory = conversation.messages
          .map((msg) => `${msg.sender}: ${msg.text}`)
          .join("\n");
      } else {
        // Conversation doesn't exist, so we create a new one
        currentConversationId = null; 
      }
    }

    const aiResponse = await generateChatResponse({
      conversationHistory: conversationHistory,
      latestMessage: messageText,
    });
    
    const aiResponseText = aiResponse.response;

    const now = new Date();
    const userMessage: Omit<Message, 'id'> = {
        text: messageText,
        sender: 'user',
        createdAt: Timestamp.fromDate(now)
    };
    
    const aiMessage: Omit<Message, 'id'> = {
        text: aiResponseText,
        sender: 'ai',
        createdAt: Timestamp.fromDate(now)
    };

    if (currentConversationId) {
      const conversationRef = doc(db, 'conversations', currentConversationId);
      // For updates, we create new message objects for arrayUnion, but use serverTimestamp for the root-level field
       const userMessageForUpdate: Omit<Message, 'id'> = {
          ...userMessage,
          createdAt: serverTimestamp() as any,
       };
        const aiMessageForUpdate: Omit<Message, 'id'> = {
          ...aiMessage,
          createdAt: serverTimestamp() as any,
        };
      await updateDoc(conversationRef, {
        messages: arrayUnion(userMessageForUpdate, aiMessageForUpdate),
        lastMessageAt: serverTimestamp()
      });
    } else {
      const newConversationRef = await addDoc(collection(db, 'conversations'), {
        userId: uid,
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        messages: [userMessage, aiMessage]
      });
      currentConversationId = newConversationRef.id;
    }

    revalidatePath(`/chat/${currentConversationId}`);
    revalidatePath(`/chat/dashboard`);

    return { success: true, aiResponse: aiResponseText, conversationId: currentConversationId };
  } catch (error) {
    console.error("Error sending message:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}


export async function getConversations(uid: string) {
  if (!uid) {
    return { success: false, error: "User is not authenticated." };
  }
  const { db } = getFirebaseInstances();
   if (!db) {
    return { success: false, error: "Database is not initialized." };
  }
  try {
    const q = query(
      collection(db, "conversations"),
      where("userId", "==", uid),
      // orderBy("lastMessageAt", "desc"), // This query requires a composite index. Removing for now.
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    const conversations = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const lastMessage = data.messages[data.messages.length - 1];
        return {
            id: doc.id,
            title: lastMessage?.text.substring(0, 30) + '...' || 'New Conversation',
        }
    });
    return { success: true, conversations };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    const errorMessage = error instanceof Error ? `Error fetching conversations: "${error.message}"` : "An unknown error occurred while fetching conversations.";
    return { success: false, error: errorMessage };
  }
}
