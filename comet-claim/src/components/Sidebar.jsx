import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiEdit, FiFlag, FiUser, FiLogOut } from 'react-icons/fi';
import { AiOutlineHistory } from 'react-icons/ai';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { logout } from '../auth/authService';
import logo from '../assets/logo.png';
import { auth } from '../firebase/firebaseConfig';
import { getIdTokenResult, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const idTokenResult = await getIdTokenResult(currentUser);
          setUserRole(idTokenResult.claims.role);
        } else {
          console.log('No current user');
        }
      } catch (error) {
        console.error('Error fetching token result:', error);
      }
    });

    return () => unsubscribe(); 
  }, []);

  if (location.pathname === '/login') {
    return null;
  } else {
    const handleLogout = async () => {
      await logout();
      navigate('/login');
    };

    if (userRole === null) {
      return <div>Loading...</div>;
    }

    return (
      <div className="w-28 bg-[#E37B54] flex flex-col items-center py-6 space-y-8">
        <div className="text-white mb-2">
          <img src={logo} alt="Logo" className="h-16" />
        </div>

        {userRole === 'staff' && (
          <>
            <Link
              to="/search"
              className={`w-full p-1.5 text-white text-center ${location.pathname === '/search' ? 'opacity-100 bg-[#E29375] border-l-4 border-l-white' : 'opacity-75'}`}
            >
              <div className="mb-2">
                <FiSearch className="w-6 h-6 mx-auto" />
              </div>
              <span className="text-sm">Search</span>
            </Link>

            <Link
              to="/register"
              className={`w-full p-1.5 text-white text-center ${location.pathname === '/register' ? 'opacity-100 bg-[#E29375] border-l-4 border-l-white' : 'opacity-75'}`}
            >
              <div className="mb-2">
                <FiEdit className="w-6 h-6 mx-auto" />
              </div>
              <span className="text-sm">Register</span>
            </Link>

            <Link
              to="/report"
              className={`w-full p-1.5 text-white text-center ${location.pathname === '/report' ? 'opacity-100 bg-[#E29375] border-l-4 border-l-white' : 'opacity-75'}`}
            >
              <div className="mb-2">
                <FiFlag className="w-6 h-6 mx-auto" />
              </div>
              <span className="text-sm">Report</span>
            </Link>

            <Link
              to="/account"
              className={`w-full p-1.5 text-white text-center ${location.pathname === '/account' ? 'opacity-100 bg-[#E29375] border-l-4 border-l-white' : 'opacity-75'}`}
            >
              <div className="mb-2">
                <FiUser className="w-6 h-6 mx-auto" />
              </div>
              <span className="text-sm">Account</span>
            </Link>
          </>
        )}

        {userRole === 'student' && (
          <>
            <Link
              to="/claimRequest"
              className={`w-full p-1.5 text-white text-center ${location.pathname === '/claimRequest' ? 'opacity-100 bg-[#E29375] border-l-4 border-l-white' : 'opacity-75'}`}
            >
              <div className="mb-2">
                <IoDocumentTextOutline className="w-6 h-6 mx-auto" />
              </div>
              <span className="text-sm">Claim Request</span>
            </Link>

            <Link
              to="/history"
              className={`w-full p-1.5 text-white text-center ${location.pathname === '/history' ? 'opacity-100 bg-[#E29375] border-l-4 border-l-white' : 'opacity-75'}`}
            >
              <div className="mb-2">
                <AiOutlineHistory className="w-6 h-6 mx-auto" />
              </div>
              <span className="text-sm">History</span>
            </Link>

            <Link
              to="/account"
              className={`w-full p-1.5 text-white text-center ${location.pathname === '/account' ? 'opacity-100 bg-[#E29375] border-l-4 border-l-white' : 'opacity-75'}`}
            >
              <div className="mb-2">
                <FiUser className="w-6 h-6 mx-auto" />
              </div>
              <span className="text-sm">Account</span>
            </Link>
          </>
        )}

        <div
          className={`w-full p-1.5 text-white text-center opacity-75 cursor-pointer hover:opacity-100`} onClick={handleLogout}
        >
          <div className="mb-2">
            <FiLogOut className="w-6 h-6 mx-auto" />
          </div>
          <span className="text-sm">Logout</span>
        </div>
      </div>
    );
  }
}
