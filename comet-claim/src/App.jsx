import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar'
import Login from './pages/Login/Login'
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'
import ReportPage from './pages/ReportPage';
import Account from './pages/Account';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './ProtectedRoute'
import AdminPage from './components/AdminPage';
import ClaimRequest from './pages/claimRequest';
import StudentHistory from './pages/studentHistory';


function App() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  
  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { 
      setUser(currentUser); 
      setLoading(false); 
    }); 
    return () => unsubscribe();
   }, []); 

   if (loading) { 
    return <div>Loading...</div>;
   }

  return (
      <div className="flex min-h-screen bg-white">
      <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />}/>
            <Route path="/login" element={<Login />} />

            <Route path="/search" element={<ProtectedRoute element={SearchPage} role="staff" />} /> 
            <Route path="/register" element={<ProtectedRoute element={RegisterPage} role="staff" />} />
            <Route path="/report" element={<ProtectedRoute element={ReportPage} role="staff" />} />
            <Route path="/account" element={<ProtectedRoute element={Account} role={["staff", "student"]} />} />

            <Route path="/claimRequest" element={<ProtectedRoute element={ClaimRequest} role="student" />} /> 
            <Route path="/history" element={<ProtectedRoute element={StudentHistory} role="student" />} /> 


            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/admin" element={<AdminPage />}/>
          </Routes>
      </div>
  )
}

export default App

