import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMyProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [priestProfile, setPriestProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pandit_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('pandit_token');
      if (storedToken) {
        try {
          const res = await getMyProfile();
          setUser(res.user);
          setPriestProfile(res.priestProfile || null);
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          localStorage.removeItem('pandit_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem('pandit_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setPriestProfile(data.priestProfile || null);
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    localStorage.setItem('pandit_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setPriestProfile(data.priestProfile || null);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('pandit_token');
    setToken(null);
    setUser(null);
    setPriestProfile(null);
  };

  // Demo 1-Click logins for effortless review
  const quickDevoteeLogin = async () => {
    return await login('devotee@panditji.com', 'password123');
  };

  const quickPriestLogin = async () => {
    return await login('priest@panditji.com', 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        priestProfile,
        token,
        loading,
        isAuthenticated: !!user,
        isPriest: user?.role === 'priest',
        login,
        register,
        logout,
        setUser,
        setPriestProfile,
        quickDevoteeLogin,
        quickPriestLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
