
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
    
    // Fetch all past conversations to build a complete history for the AI.
    const historyQuery = query(
      collection(db, "conversations"),
      where("userId", "==", uid),
      orderBy("lastMessageAt", "desc")
    );
    const historySnapshot = await getDocs(historyQuery);
    const allMessages: Message[] = [];
    historySnapshot.forEach(doc => {
      const data = doc.data() as Conversation;
      if (data.messages) {
        allMessages.push(...data.messages);
      }
    });

    // Sort all messages by creation time to ensure correct chronological order
    allMessages.sort((a, b) => (a.createdAt as Timestamp).toMillis() - (b.createdAt as Timestamp).toMillis());
    conversationHistory = allMessages
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join("\n");


    // If we have a conversationId, fetch it. Otherwise, we'll create a new one.
    if (currentConversationId) {
      const convDoc = await getDoc(doc(db, "conversations", currentConversationId));
      if (!convDoc.exists()) {
        // Conversation doesn't exist, so we create a new one
        currentConversationId = null; 
      }
    }

    const aiResponse = await generateChatResponse({
      conversationHistory: conversationHistory,
      latestMessage: messageText,
      gender: "female", // Example: Hardcoded for now, can be a user setting later
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
      await updateDoc(conversationRef, {
        messages: arrayUnion(userMessage, aiMessage),
        lastMessageAt: serverTimestamp()
      });
    } else {
      const newConversationRef = doc(collection(db, 'conversations'));
      currentConversationId = newConversationRef.id;

      const newConversationData: Omit<Conversation, 'id'> = {
        userId: uid,
        createdAt: serverTimestamp() as Timestamp,
        lastMessageAt: serverTimestamp() as Timestamp,
        messages: [userMessage, aiMessage] as Message[],
      };

      await setDoc(newConversationRef, newConversationData);
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
      where("userId", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    const conversations = querySnapshot.docs.map(doc => {
        const data = doc.data() as Conversation;
        return {
            id: doc.id,
            ...data,
        }
    });

    // Sort conversations by lastMessageAt descending
    conversations.sort((a, b) => {
        const timeA = a.lastMessageAt?.toMillis() || 0;
        const timeB = b.lastMessageAt?.toMillis() || 0;
        return timeB - timeA;
    });

    const formattedConversations = conversations.slice(0, 20).map(conv => {
        const lastMessage = conv.messages[conv.messages.length - 1];
        return {
             id: conv.id,
             title: lastMessage?.text.substring(0, 30) + '...' || 'New Conversation',
        }
    });


    return { success: true, conversations: formattedConversations };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    const errorMessage = error instanceof Error ? `Error fetching conversations: "${error.message}"` : "An unknown error occurred while fetching conversations.";
    return { success: false, error: errorMessage };
  }
}
