// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOQ8h5LwcMX4YMj9N3ltPqIrx6PlVN8f4",
  authDomain: "lostandfound-d79fa.firebaseapp.com",
  projectId: "lostandfound-d79fa",
  storageBucket: "lostandfound-d79fa.firebasestorage.app",
  messagingSenderId: "51277916995",
  appId: "1:51277916995:web:19da2f7392b027a20addf6",
  measurementId: "G-QQDV4R68W2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const staffAuth = async(email, password)=>{
  try {
      await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
      console.log(error);
      toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const studentAuth = async(email, password)=>{
  try {
      await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
      console.log(error);
      toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}


const logout = ()=>{
  signOut(auth);
}

export {auth, db, staffAuth, studentAuth, logout};