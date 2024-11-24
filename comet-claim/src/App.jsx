import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'
import Sidebar from './components/Sidebar'
import Login from './pages/Login/Login'

function App() {
  const navigate = useNavigate();

  useEffect(()=>{
    onAuthStateChanged(auth, async(user)=>{
      if(user){
        console.log("Logged In");
        navigate('/');

      }
      else{
        console.log("Logged Out");
        navigate('/login');
      }
    })
  },[])
  return (
      <div className="flex min-h-screen bg-white">
      <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />}/>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/report" element={<div>Report Page (Coming Soon)</div>} />
          <Route path="/account" element={<div>Account Page (Coming Soon)</div>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
  )
}

export default App