// Single place for the admin session keys, so api.js (interceptors) and
// auth.service.js can share them without a circular import.
const TOKEN_KEY = 'admin_token';
const REFRESH_KEY = 'admin_refresh_token';
const USER_KEY = 'admin_user';

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};
