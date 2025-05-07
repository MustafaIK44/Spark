import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBWRrOKm3uMBcgpxq-pIDg-9L-WxmlHpB8",
  authDomain: "sparknew-e4575.firebaseapp.com",
  projectId: "sparknew-e4575",
  storageBucket: "sparknew-e4575.firebasestorage.app",
  messagingSenderId: "611670244363",
  appId: "1:611670244363:web:eb28ce781e5b2dc639db0e",
  measurementId: "G-0BHQ5HDR6W"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { app, db, auth, provider };
