import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar'
import Login from './pages/Login/Login'
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'
import ReportPage from './pages/ReportPage';
import Account from './pages/Account';
import StudentDashboard from './pages/StudentDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './ProtectedRoute'
import AdminPage from './components/AdminPage';


function App() {
  return (
      <div className="flex min-h-screen bg-white">
      <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />}/>
            <Route path="/login" element={<Login />} />

            <Route path="/search" element={<ProtectedRoute element={SearchPage} role="staff" />} /> 
            <Route path="/register" element={<ProtectedRoute element={RegisterPage} role="staff" />} />
            <Route path="/report" element={<ProtectedRoute element={ReportPage} role="staff" />} />
            <Route path="/account" element={<ProtectedRoute element={Account} role="staff" />} />

            <Route path="/studentDashboard" element={<ProtectedRoute element={StudentDashboard} role="student" />} /> 

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/admin" element={<AdminPage />}/>
          </Routes>
      </div>
  )
}

export default App

