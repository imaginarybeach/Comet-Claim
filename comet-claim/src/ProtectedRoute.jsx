import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../src/firebase/firebaseConfig';

function ProtectedRoute({ element: Component, role, ...rest }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then(idTokenResult => {
        console.log('User claims:', idTokenResult.claims);
        console.log('User:', user);
        

        const userRole = idTokenResult.claims.role;
        console.log('User role:', userRole);

        if (role.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      }).catch(error => {
        console.error('Error getting token result:', error);
        setIsAuthorized(false);
      });
    } else {
      setIsAuthorized(false);
    }
  }, [user, role]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? ( 
    <Component {...rest} /> 
  ) : ( 
    <Navigate to={user ? "/unauthorized" : "/login"} state={{ from: location }} replace />
  );

    
}

export default ProtectedRoute;
