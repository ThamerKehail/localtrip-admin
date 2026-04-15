import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError('');
    try {
      const u = await loginService(email, password);
      setUser(u);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || err.message || 'Login failed');
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
    <AuthContext.Provider value={{ user, loading, authError, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
