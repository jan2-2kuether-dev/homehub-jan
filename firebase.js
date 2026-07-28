import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig={
 apiKey:"AIzaSyDmGREKGpuYnl-Kbkl1BPRdIJexRyJxW2A",
 authDomain:"homehub-jan.firebaseapp.com",
 projectId:"homehub-jan",
 storageBucket:"homehub-jan.firebasestorage.app",
 messagingSenderId:"817189630956",
 appId:"1:817189630956:web:7e45a78b978e282c5bc6c9"
};

const app=initializeApp(firebaseConfig);
export const db=getFirestore(app);
