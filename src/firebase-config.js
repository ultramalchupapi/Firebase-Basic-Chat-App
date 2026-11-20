// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signOut,
} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC670v-dXQR-UJ-RPq4wrxUhij0Rl8W81Q",
    authDomain: "basic-chat-app-9748e.firebaseapp.com",
    projectId: "basic-chat-app-9748e",
    storageBucket: "basic-chat-app-9748e.firebasestorage.app",
    messagingSenderId: "710526275614",
    appId: "1:710526275614:web:251078d80061b5f7ec1e0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

export const provider = new GoogleAuthProvider()
export const signIn = createUserWithEmailAndPassword

export const logOut = () => signOut(auth)

export const db = getFirestore(app)