import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGSJxtDlwOscfKi3S26SEN0uTiZ5rnbSg",
  authDomain: "sudoku-gamee.firebaseapp.com",
  projectId: "sudoku-gamee",
  storageBucket: "sudoku-gamee.firebasestorage.app",
  messagingSenderId: "117133759867",
  appId: "1:117133759867:web:c99e0e546a8d20cf7099de"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);