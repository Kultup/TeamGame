import { useState, useCallback, useEffect } from 'react';

const ADMIN_TOKEN_KEY = 'admin_authenticated';
const ADMIN_TOKEN_VALUE = 'team-game-admin-2024'; // Simple token for demo

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback((inputPassword) => {
    // Simple password check (in production, use proper auth)
    if (inputPassword === 'admin123' || inputPassword === ADMIN_TOKEN_VALUE) {
      localStorage.setItem(ADMIN_TOKEN_KEY, 'true');
      setIsAuthenticated(true);
      setError(null);
      return true;
    }
    setError('Неправильний пароль');
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAuthenticated(false);
    setShowLogin(false);
    setError(null);
  }, []);

  const openLogin = useCallback(() => {
    setShowLogin(true);
    setError(null);
    setPassword('');
  }, []);

  const closeLogin = useCallback(() => {
    setShowLogin(false);
    setError(null);
    setPassword('');
  }, []);

  return {
    isAuthenticated,
    showLogin,
    password,
    setPassword,
    error,
    login,
    logout,
    openLogin,
    closeLogin,
  };
}
