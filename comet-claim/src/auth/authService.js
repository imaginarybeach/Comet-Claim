import {app} from '../firebase/firebaseConfig';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import axios from 'axios';

const auth = getAuth(app);

const signIn = async(email, password)=>{
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user);
    return userCredential.user;
    
  } catch (error) {
      console.log("Error signing inn: ", error);
      toast.error(error.code.split('/')[1].split('-').join(" ") || "Failed to sign in");
  }
}

const logout = async()=>{
  try { 
    await signOut(auth); 
    console.log("logged out");
    toast.success("Successfully logged out."); 
  }
  catch (error) { 
    console.error('Error signing out:', error); 
    toast.error(error.code.split('/')[1].split('-').join(" ") || "Failed to logout");
  }
}

const setRole = async (uid, role) => { 
  const user = auth.currentUser; 
  if (!user) { 
    throw new Error('User is not authenticated'); 
  } try { 
    const idToken = await user.getIdToken(true); 
    const response = await axios.post('http://localhost:3001/setRole', { uid, role }, { headers: { Authorization: `Bearer ${idToken}` } }); 
    console.log('Role set successfully.'); 
    toast.success("Role set successful"); 
    return response.data; 
  } catch (error) { 
    console.error('Error setting role:', error); 
    toast.success("Error setting role"); 
  }
}


export { signIn, logout, setRole };
