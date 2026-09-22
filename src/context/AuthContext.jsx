import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser } from '../services/auth.service';
import { setAuthFailureHandler } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);
  // Raw error from the last login attempt; the Login page localizes it.
  const [authError, setAuthError] = useState(null);
  // Translation key explaining why the session ended (expired / not admin).
  const [authNotice, setAuthNotice] = useState('');

  useEffect(() => {
    // Storage is already cleared by api.js; dropping `user` makes
    // ProtectedRoute redirect to /login via the router (no reload).
    setAuthFailureHandler((reason) => {
      setUser(null);
      setAuthError(null);
      setAuthNotice(reason === 'adminOnly' ? 'errAdminOnly' : 'errSessionExpired');
    });
    return () => setAuthFailureHandler(null);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError(null);
    setAuthNotice('');
    try {
      const u = await loginService(email, password);
      setUser(u);
      return true;
    } catch (err) {
      setAuthError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, authError, authNotice, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
