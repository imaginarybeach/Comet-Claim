import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/report" element={<div>Report Page (Coming Soon)</div>} />
          <Route path="/account" element={<div>Account Page (Coming Soon)</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App