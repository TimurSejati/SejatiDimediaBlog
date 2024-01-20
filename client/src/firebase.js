// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sejati-dimedia-blog.firebaseapp.com",
  projectId: "sejati-dimedia-blog",
  storageBucket: "sejati-dimedia-blog.appspot.com",
  messagingSenderId: "914085223308",
  appId: "1:914085223308:web:04b8dc7a577bdc287f14a9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
