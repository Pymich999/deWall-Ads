import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOQPKuv3M61tgTaSrfej6Q0bbg7jk6tx4",
  authDomain: "dewallads-webapp.firebaseapp.com",
  projectId: "dewallads-webapp",
  storageBucket: "dewallads-webapp.firebasestorage.app",
  messagingSenderId: "923335292583",
  appId: "1:923335292583:web:3aeaf70523e50a7800cd82",
  measurementId: "G-RKWMRVFMDZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, storage };

