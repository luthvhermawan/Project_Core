import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA9vuLcSqwrgVpoWlhF4UIYcJy9SbxYpNo",
  authDomain: "amorty-billiards-pwa.firebaseapp.com",
  projectId: "amorty-billiards-pwa",
  storageBucket: "amorty-billiards-pwa.appspot.com", // ✅ ini yang benar
  messagingSenderId: "398396853348",
  appId: "1:398396853348:web:e53a2c7da09915d5566371",
  measurementId: "G-X6LYWRM4JZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app); // ✅ ini udah oke buat Realtime Database
