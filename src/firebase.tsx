import { getStorage } from "@firebase/storage";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIKN5SBeChMzAsPBS2GRsWzaiPtYpW-7Y",
  authDomain: "starbucks-b3b95.firebaseapp.com",
  projectId: "starbucks-b3b95",
  storageBucket: "starbucks-b3b95.appspot.com",
  messagingSenderId: "990180399542",
  appId: "1:990180399542:web:2f1e7d357e063f6f8b0917",
  measurementId: "G-6ZF89F0X1J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;

export const db = getFirestore(app);

const storage = getStorage(app);
