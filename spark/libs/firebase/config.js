import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBDwqCtuQAIdWWNZOSNLMMMXTjXQX4VK8I",
  authDomain: "spark2-f41c4.firebaseapp.com",
  projectId: "spark2-f41c4",
  storageBucket: "spark2-f41c4.firebasestorage.app",
  messagingSenderId: "710209191306",
  appId: "1:710209191306:web:135d88206981e43992dc73",
  measurementId: "G-ZFKX6VGXL9"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db };
