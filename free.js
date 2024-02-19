// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9on0vCShngxCpDaFUlIN5AOML4qxABqw",
  authDomain: "testing-413101.firebaseapp.com",
  projectId: "testing-413101",
  storageBucket: "testing-413101.appspot.com",
  messagingSenderId: "948178692986",
  appId: "1:948178692986:web:f3a4a3c6bbbf87afe804c3",
  measurementId: "G-N3SNPSMRS2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
