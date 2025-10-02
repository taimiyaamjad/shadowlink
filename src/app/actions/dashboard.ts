"use server";

import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getDashboardData(uid: string) {
  if (!uid) {
    throw new Error("User is not authenticated.");
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

    conversationsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.messages && Array.isArray(data.messages)) {
        totalMessages += data.messages.length;
        data.messages.forEach((message: { sender: 'user' | 'ai', createdAt: Timestamp }) => {
          if (message.sender === 'user') {
            userMessages++;
          } else {
            aiMessages++;
          }

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

    return {
      totalConversations: conversationsSnapshot.size,
      totalMessages,
      userMessages,
      aiMessages,
      messageVolume,
      messageDistribution
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unknown error occurred." };
  }
}
