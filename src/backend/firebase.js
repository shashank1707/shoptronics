import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAgsEcXgtBzdbf6gH4rJz3irLgGLJMg95k",
  authDomain: "e-commerce-a71ed.firebaseapp.com",
  projectId: "e-commerce-a71ed",
  storageBucket: "e-commerce-a71ed.appspot.com",
  messagingSenderId: "313750386804",
  appId: "1:313750386804:web:ab390993baee74825f3921"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;