// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCnjV9ihLVqXgYQc8EAxNXDsRNub-NxBnc',
  authDomain: 'fire-chat-app-65bd4.firebaseapp.com',
  projectId: 'fire-chat-app-65bd4',
  storageBucket: 'fire-chat-app-65bd4.firebasestorage.app',
  messagingSenderId: '695726399535',
  appId: '1:695726399535:web:28a52381f1522117f226da',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, auth, firestore };
