"use server";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "@/lib/types";

export async function createUserInFirestore(
  uid: string,
  email: string | null,
  displayName: string | null,
  photoURL: string | null
) {
  try {
    const userRef = doc(db, "users", uid);
    const userData: User = {
      uid,
      email,
      displayName,
      photoURL,
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, userData);
    return { success: true };
  } catch (error) {
    console.error("Error creating user in Firestore:", error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred." };
  }
}
