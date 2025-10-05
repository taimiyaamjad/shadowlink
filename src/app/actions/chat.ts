
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
  setDoc,
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
    
    const now = new Date();
    const userMessage: Omit<Message, 'id'> = {
        text: messageText,
        sender: 'user',
        createdAt: Timestamp.fromDate(now)
    };

    // If it's a new chat, create it first and get the ID.
    if (!currentConversationId) {
      const newConversationRef = doc(collection(db, 'conversations'));
      currentConversationId = newConversationRef.id;

      const newConversationData: Omit<Conversation, 'id'> = {
        userId: uid,
        createdAt: serverTimestamp() as Timestamp,
        lastMessageAt: serverTimestamp() as Timestamp,
        messages: [userMessage] as Message[],
      };
      await setDoc(newConversationRef, newConversationData);
    } else {
      // It's an existing conversation, just add the user's message.
      const conversationRef = doc(db, 'conversations', currentConversationId);
      await updateDoc(conversationRef, {
        messages: arrayUnion(userMessage),
        lastMessageAt: serverTimestamp()
      });
    }

    // Await the AI response generation
    await generateAndAddAiResponse(uid, currentConversationId, messageText);
    
    // Return after AI has responded
    return { success: true, conversationId: currentConversationId };

  } catch (error) {
    console.error("Error sending message:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}

// This function now runs as part of the main sendMessage flow.
async function generateAndAddAiResponse(uid: string, conversationId: string, latestMessage: string) {
    const { db } = getFirebaseInstances();
    if (!db) return;

    try {
        // Fetch all past conversations to build a complete history for the AI.
        const historyQuery = query(
          collection(db, "conversations"),
          where("userId", "==", uid)
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
        const conversationHistory = allMessages
          .map((msg) => `${msg.sender}: ${msg.text}`)
          .join("\n");

        const aiResponse = await generateChatResponse({
          conversationHistory: conversationHistory,
          latestMessage: latestMessage,
          gender: "female",
        });
        
        const aiResponseText = aiResponse.response;

        const aiMessage: Omit<Message, 'id'> = {
            text: aiResponseText,
            sender: 'ai',
            createdAt: Timestamp.now()
        };

        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, {
            messages: arrayUnion(aiMessage),
            lastMessageAt: serverTimestamp()
        });

    } catch(error) {
        console.error("Error generating or saving AI response:", error);
        // Optionally, you could add an error message to the chat here
        // to let the user know something went wrong with the AI response.
        const conversationRef = doc(db, 'conversations', conversationId);
        const errorMessage: Omit<Message, 'id'> = {
            text: "Sorry, I encountered an error and couldn't respond.",
            sender: 'ai',
            createdAt: Timestamp.now()
        };
        await updateDoc(conversationRef, {
            messages: arrayUnion(errorMessage),
            lastMessageAt: serverTimestamp()
        });
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
    // Only filter by userId. Sorting will be done in the action.
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

    // Sort conversations by lastMessageAt descending on the server.
    conversations.sort((a, b) => {
        const timeA = a.lastMessageAt?.toMillis() || 0;
        const timeB = b.lastMessageAt?.toMillis() || 0;
        return timeB - timeA;
    });

    const formattedConversations = conversations.slice(0, 20).map(conv => {
        const lastMessage = conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
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
