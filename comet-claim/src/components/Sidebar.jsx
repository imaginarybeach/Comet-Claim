import { Link, useLocation } from 'react-router-dom'
import { FiSearch, FiEdit, FiFlag, FiUser } from 'react-icons/fi'

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="w-24 bg-[#E37B54] flex flex-col items-center py-6 space-y-8">
      <div className="text-white">
        <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
      </div>
      
      <Link 
        to="/search" 
        className={`text-white text-center ${location.pathname === '/search' ? 'opacity-100' : 'opacity-75'}`}
      >
        <div className="mb-2">
          <FiSearch className="w-6 h-6 mx-auto" />
        </div>
        <span className="text-sm">Search</span>
      </Link>

      <Link 
        to="/register" 
        className={`text-white text-center ${location.pathname === '/register' ? 'opacity-100' : 'opacity-75'}`}
      >
        <div className="mb-2">
          <FiEdit className="w-6 h-6 mx-auto" />
        </div>
        <span className="text-sm">Register</span>
      </Link>

      <Link 
        to="/report" 
        className={`text-white text-center ${location.pathname === '/report' ? 'opacity-100' : 'opacity-75'}`}
      >
        <div className="mb-2">
          <FiFlag className="w-6 h-6 mx-auto" />
        </div>
        <span className="text-sm">Report</span>
      </Link>

      <Link 
        to="/account" 
        className={`text-white text-center ${location.pathname === '/account' ? 'opacity-100' : 'opacity-75'}`}
      >
        <div className="mb-2">
          <FiUser className="w-6 h-6 mx-auto" />
        </div>
        <span className="text-sm">Account</span>
      </Link>
    </div>
  )
}