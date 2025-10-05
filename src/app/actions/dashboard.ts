
"use server";

import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { getFirebaseInstances } from "@/lib/firebase";
import { analyzeConversationPatterns } from "@/ai/flows/analyze-conversation-patterns";
import { Conversation } from "@/lib/types";

export async function getDashboardData(uid: string) {
  if (!uid) {
    throw new Error("User is not authenticated.");
  }
  const { db } = getFirebaseInstances();
  if (!db) {
    throw new Error("Database is not initialized.");
  }

  try {
    const conversationsQuery = query(collection(db, "conversations"), where("userId", "==", uid));
    const conversationsSnapshot = await getDocs(conversationsQuery);

    let totalMessages = 0;
    let userMessages = 0;
    let aiMessages = 0;
    
    const today = new Date();
    const last7Days = new Array(7).fill(0).map((_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - i);
        return d;
    });

    const messageVolume = last7Days.map(date => ({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        user: 0,
        ai: 0,
    })).reverse();

    const allMessages: { sender: 'user' | 'ai', text: string, createdAt: Timestamp }[] = [];

    conversationsSnapshot.forEach(doc => {
      const data = doc.data() as Conversation;
      if (data.messages && Array.isArray(data.messages)) {
        totalMessages += data.messages.length;
        data.messages.forEach((message) => {
          if (message.sender === 'user') {
            userMessages++;
          } else {
            aiMessages++;
          }

          allMessages.push(message);

          if (message.createdAt) {
            const messageDate = message.createdAt.toDate();
            const diffDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays < 7) {
                const dayIndex = 6 - diffDays;
                if(message.sender === 'user') {
                    messageVolume[dayIndex].user++;
                } else {
                    messageVolume[dayIndex].ai++;
                }
            }
          }
        });
      }
    });

    const messageDistribution = [
        { name: 'User', value: userMessages, fill: 'hsl(var(--primary))' },
        { name: 'AI', value: aiMessages, fill: 'hsl(var(--accent))' }
    ];

    let trajectoryAnalysis = null;
    if (allMessages.length > 5) { // Only analyze if there's enough data
      const conversationHistory = allMessages
        .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
        .map(msg => `${msg.sender}: ${msg.text}`)
        .join('\n');
      
      try {
        trajectoryAnalysis = await analyzeConversationPatterns({ conversationHistory });
      } catch (aiError) {
        console.error("Error analyzing conversation patterns:", aiError);
        // Don't block dashboard load if AI fails
        trajectoryAnalysis = {
            writingStyle: "Could not be determined.",
            tone: "Could not be determined.",
            responsePatterns: "Could not be determined."
        }
      }
    }


    return {
      totalConversations: conversationsSnapshot.size,
      totalMessages,
      userMessages,
      aiMessages,
      messageVolume,
      messageDistribution,
      trajectoryAnalysis
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unknown error occurred." };
  }
}
