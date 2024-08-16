import React, { createContext, useState, useEffect } from 'react';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
