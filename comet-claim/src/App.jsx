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
import ClaimRequest from './pages/ClaimRequest';
import StudentHistory from './pages/StudentHistory';
import { AuthProvider } from './auth/authService.jsx';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8">
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
            <Route path="/admin" element={<ProtectedRoute element={AdminPage} role="admin" />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App
