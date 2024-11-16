import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxEb87JMfCT2Qq0Tizk6nHuxoVUWRsddw",
  authDomain: "invest-the-nest.firebaseapp.com",
  projectId: "invest-the-nest",
  storageBucket: "invest-the-nest.firebasestorage.app",
  messagingSenderId: "840424813504",
  appId: "1:840424813504:web:316a413457ba9031a74e25",
  measurementId: "G-87XCSW88K3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, auth };