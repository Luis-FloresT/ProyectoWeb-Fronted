import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as apiLogin } from '../api';

export const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('is_admin') === 'true');

  // Sync with localStorage changes (e.g., another tab)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') setToken(e.newValue);
      if (e.key === 'is_admin') setIsAdmin(e.newValue === 'true');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback(async ({ usuario, clave }) => {
    const res = await apiLogin({ usuario, clave });
    const { id, cliente_id, token: tk, is_admin, username } = res.data;
    if (tk) {
      localStorage.setItem('token', tk);
      setToken(tk);
    }
    if (id) localStorage.setItem('id', String(id));
    if (cliente_id) localStorage.setItem('cliente_id', String(cliente_id));
    localStorage.setItem('is_admin', String(is_admin ?? false));
    setIsAdmin(Boolean(is_admin));
    if (username) localStorage.setItem('username', username);
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('cliente_id');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('username');
    setToken(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo(() => ({
    token,
    isAuthenticated: Boolean(token),
    isAdmin,
    login,
    logout,
  }), [token, isAdmin, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
