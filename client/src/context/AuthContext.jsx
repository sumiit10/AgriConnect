import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const result = await api('/api/auth/me');
      setUser(result.user || null);
      return result.user || null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = useCallback(async (credentials) => {
    const result = await api('/api/auth/login', {
      method: 'POST', body: JSON.stringify(credentials)
    });
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (details) => {
    return api('/api/auth/register', {
      method: 'POST', body: JSON.stringify(details)
    });
  }, []);

  const updateProfile = useCallback(async (details) => {
    const result = await api('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(details) });
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    try { await api('/api/auth/logout', { method: 'POST' }); }
    finally { setUser(null); }
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, updateProfile, logout, refreshUser }),
    [user, loading, login, register, updateProfile, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
