import api from './api';
import { getAccessToken, getStoredUser, setStoredUser, setTokens, clearAuthStorage } from './authStorage';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  const { accessToken, refreshToken, user } = data.data || {};

  if (!user || user.role !== 'admin') {
    const err = new Error('Access denied. Admin accounts only.');
    err.appCode = 'NOT_ADMIN';
    throw err;
  }

  clearAuthStorage();
  setTokens(accessToken, refreshToken);
  setStoredUser(user);
  return user;
};

export const logout = async () => {
  try { await api.post('/auth/logout'); } catch { /* best effort — local session is cleared regardless */ }
  clearAuthStorage();
};

export const getCurrentUser = () => (getAccessToken() ? getStoredUser() : null);
