import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetchJson, postJson } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const authRequestVersion = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestVersion = authRequestVersion.current;
    fetchJson('/api/users/profile', { signal: controller.signal })
      .then(({ user: profile }) => {
        if (requestVersion !== authRequestVersion.current) return;
        setUser(profile);
        setStatus('authenticated');
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return;
        if (requestVersion !== authRequestVersion.current) return;
        setUser(null);
        setStatus('unauthenticated');
        setError(requestError.status === 401 ? '' : requestError.message);
      });

    return () => controller.abort();
  }, []);

  const login = useCallback(async (credentials) => {
    authRequestVersion.current += 1;
    setUser(null);
    setStatus('unauthenticated');
    setError('');
    try {
      const result = await postJson('/api/auth/login', credentials);
      if (!result?.user) throw new Error('The server did not return a user profile.');
      setUser(result.user);
      setStatus('authenticated');
      return result.user;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  }, []);

  const register = useCallback(async (details) => {
    authRequestVersion.current += 1;
    setUser(null);
    setStatus('unauthenticated');
    setError('');
    try {
      await postJson('/api/auth/register', details);
      return await login({ email: details.email, password: details.password });
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  }, [login]);

  const logout = useCallback(async () => {
    authRequestVersion.current += 1;
    setError('');
    try {
      await postJson('/api/auth/logout', {});
      setUser(null);
      setStatus('unauthenticated');
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    status,
    error,
    login,
    register,
    logout,
  }), [user, status, error, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
