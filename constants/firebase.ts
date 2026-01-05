// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbWRGOuZ5elogCydHDnSr-Tx_rqpobl8s",
  authDomain: "life-plan-51278.firebaseapp.com",
  projectId: "life-plan-51278",
  storageBucket: "life-plan-51278.firebasestorage.app",
  messagingSenderId: "353998024239",
  appId: "1:353998024239:web:6b2602fda8dffe592be0da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };

