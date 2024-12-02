import React, { useState, useRef } from 'react';
import './Login.css';
import logo from '../../assets/logo.png';
import { getAuth, getIdTokenResult } from 'firebase/auth';
import { signIn } from '../../auth/authService';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const userRef = useRef();

  const [authRole, setAuthRole] = useState("STAFF SIGN IN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      const user = await signIn(email, password);
      const auth = getAuth();
      const idTokenResult = await getIdTokenResult(auth.currentUser);

      console.log("Token Result: ", idTokenResult);

      if (authRole === "STAFF SIGN IN" && idTokenResult.claims.role === 'staff') {
        toast.success("Logged In", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => navigate('/search'), 1500);
      } else if (authRole === "STUDENT SIGN IN" && idTokenResult.claims.role === 'student') {
        navigate('/claimRequest');
        toast.success("Logged In", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => navigate('/claimRequest'), 1500);
      } else {
        console.error('Unauthorized access:', idTokenResult.claims.role);
        toast.error("Unauthorized access", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(error.message.split('/')[1].split('-').join(" ") || 'Failed to log in', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className='login'>
      <div className='left'>
        <img src={logo} alt="Logo"/>
        <h1>COMETCOLLECT</h1>
      </div>
      <div className='right'>
        <h2>{authRole}</h2>
        <form onSubmit={handleSubmit}>
          <input value={email} type="email" ref={userRef} onChange={(e) => setEmail(e.target.value)} required placeholder='Email' />
          <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} required placeholder='Password' />
          <button type="submit">SUBMIT</button>
        </form>

        <div className='role_switch'>
          {authRole === "STAFF SIGN IN" ? (
            <span onClick={() => setAuthRole("STUDENT SIGN IN")}>STUDENT SIGN IN</span>
          ) : (
            <span onClick={() => setAuthRole("STAFF SIGN IN")}>STAFF SIGN IN</span>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
