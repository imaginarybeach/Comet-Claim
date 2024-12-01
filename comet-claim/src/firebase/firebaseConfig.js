import { initializeApp } from "firebase/app";
import { getAuth,setPersistence, browserSessionPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCOQ8h5LwcMX4YMj9N3ltPqIrx6PlVN8f4",
  authDomain: "lostandfound-d79fa.firebaseapp.com",
  projectId: "lostandfound-d79fa",
  storageBucket: "lostandfound-d79fa.firebasestorage.app",
  messagingSenderId: "51277916995",
  appId: "1:51277916995:web:19da2f7392b027a20addf6",
  measurementId: "G-QQDV4R68W2"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence) 
  .then(() => { 
    console.log('Session persistence set'); 
  }) 
  .catch((error) => { 
    console.error('Error setting persistence:', error); 
  });

export { app, auth };
