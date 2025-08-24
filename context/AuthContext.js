'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Stare de încărcare

  // Verifică token-ul la inițializarea aplicației
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      validateToken(token);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const apiUrl = `/api/validate-token`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.message === 'Token is valid') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        Cookies.remove('token'); // Șterge token-ul invalid
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setIsAuthenticated(false);
      router.push(`/_error?errorCode=${error.response.status}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('token'); // Șterge token-ul
    setIsAuthenticated(false); // Actualizează starea
  };

  if (loading) {
    return <div></div>; // UI blocat până termină validarea
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
