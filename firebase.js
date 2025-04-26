
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXjQlt_W_Oj0BnL4GbYUc78jSPAJlqN0Q",
  authDomain: "chefstuff-7c2af.firebaseapp.com",
  projectId: "chefstuff-7c2af",
  storageBucket: "chefstuff-7c2af.firebasestorage.app",
  messagingSenderId: "846509548380",
  appId: "1:846509548380:web:8c1905fbbc8ac6ed179799"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, db };
