// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmG1UGd9ak3aIiM1bNWOj0wS1Y9JKh51A",
  authDomain: "inventory-management-d25ae.firebaseapp.com",
  projectId: "inventory-management-d25ae",
  storageBucket: "inventory-management-d25ae.appspot.com",
  messagingSenderId: "597431255512",
  appId: "1:597431255512:web:8c6a7d84c3fec4b5c3f2ad",
  measurementId: "G-2KNYGDRWXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);


export {firestore}