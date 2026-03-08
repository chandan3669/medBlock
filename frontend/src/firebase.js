import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDLcoFSG3tej8TNK1C4zh1MNELImq90mGc",
    authDomain: "medblock-78f32.firebaseapp.com",
    projectId: "medblock-78f32",
    storageBucket: "medblock-78f32.firebasestorage.app",
    messagingSenderId: "920109124371",
    appId: "1:920109124371:web:a9b88ccdafbc64cb2ee8e6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account"
});

export default app;