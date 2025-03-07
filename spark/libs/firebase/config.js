import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCz7psZeWnTvuNHwBppwB4AIz9-5jMgXwE",
  authDomain: "spark-be1a0.firebaseapp.com",
  projectId: "spark-be1a0",
  storageBucket: "spark-be1a0.firebasestorage.app",
  messagingSenderId: "137000992507",
  appId: "1:137000992507:web:d715969b83eb7d7b9aba5e",
  measurementId: "G-G2HSKCG6EW"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db };
