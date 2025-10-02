import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKuab2rXjqxRLfryb1BWo7vZtqou_oUsI",
  authDomain: "studio-7323600193-a0601.firebaseapp.com",
  projectId: "studio-7323600193-a0601",
  storageBucket: "studio-7323600193-a0601.appspot.com",
  messagingSenderId: "228477398831",
  appId: "1:228477398831:web:76f176d3dce113988abbda",
};

function getFirebaseInstances() {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { app, auth, db };
}

// We are exporting the function to get instances,
// and also pre-initialized instances for server-side compatibility where needed.
const { app, auth, db } = getFirebaseInstances();
export { app, auth, db, getFirebaseInstances };
