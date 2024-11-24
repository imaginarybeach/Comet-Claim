import React, { useState, useRef, useEffect } from 'react'
import './Login.css'
//import staffAuth and studentAuth from prisma
import {staffAuth, studentAuth} from '../../firebase'

export default function Login() {
    const userRef = useRef();
    const errorRef = useRef();

    const [authRole, setauthRole] = useState("STAFF SIGN IN");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
//            <p ref={errorMsg} className = {errorMsg ? "errorMsg" : "offscreen"} aria-live='assertive'>{errorMsg}</p>

    
    

    const handleSubmit = async(event)=>{
        event.preventDefault();
        if(authRole === "STAFF SIGN IN"){
          await staffAuth(email, password);
        }
        else{
          await studentAuth(email, password);
        }
      }


    return (
        <div className='login'>
            <div className='left'>
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
                <h1>COMETCOLLECT</h1>
            </div>
            <div className='right'>

                <h2>{authRole}</h2>
                <form>
                <input value={email} type="email" ref={userRef} onChange={(e)=>{setEmail(e.target.value)}} required placeholder='Email'/>
                <input value={password} type="password" onChange={(e)=>{setPassword(e.target.value)}} required placeholder='Password'/>
                <button onClick={handleSubmit} type="submit">SUBMIT</button>
                </form>

                <div className='role_switch'>
                    {authRole === "STAFF SIGN IN"? <span onClick={()=>{setauthRole("STUDENT SIGN IN")}}>STUDENT SIGN IN</span>:<span onClick={()=>{setauthRole("STAFF SIGN IN")}}>STAFF SIGN IN</span>}
                </div>
            </div>
        </div>
    )
}


