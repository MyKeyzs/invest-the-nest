import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
