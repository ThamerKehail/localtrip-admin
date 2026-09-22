import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearAuthStorage } from './authStorage';
import { resolveErrorCode } from '../utils/errors';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const timeout = 15000;

const api = axios.create({ baseURL, timeout });

// /auth/* calls (login, logout, refresh) must never trigger refresh/logout:
// a 401 from /auth/login is a wrong password, not an expired session.
const isAuthCall = (config) => /(^|\/)auth\//.test(config?.url || '');

// Registered by AuthContext so a failed session is handled with router state
// (no full page reload). Receives a reason: 'session' | 'adminOnly'.
let onAuthFailure = null;
export const setAuthFailureHandler = (fn) => { onAuthFailure = fn; };

const handleAuthFailure = (reason) => {
  clearAuthStorage();
  if (onAuthFailure) onAuthFailure(reason);
  else window.location.assign('/login');
};

// Single-flight refresh: concurrent 401s share one POST /auth/refresh-token.
let refreshPromise = null;
const refreshAccessToken = () => {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();
    const request = refreshToken
      ? axios.post(`${baseURL}/auth/refresh-token`, { refreshToken }, { timeout })
      : Promise.reject(Object.assign(new Error('No refresh token'), { noRefreshToken: true }));

    refreshPromise = request
      .then(({ data }) => {
        const payload = data?.data ?? data ?? {};
        const accessToken = payload.accessToken ?? data?.accessToken;
        if (!accessToken) throw Object.assign(new Error('No access token in refresh response'), { noRefreshToken: true });
        setTokens(accessToken, payload.refreshToken ?? data?.refreshToken);
        return accessToken;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
};

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config, response } = err;
    if (!response || !config || isAuthCall(config)) return Promise.reject(err);

    if (response.status === 401) {
      if (config._retried) {
        handleAuthFailure('session');
        return Promise.reject(err);
      }
      try {
        const token = await refreshAccessToken();
        config._retried = true;
        config.headers.Authorization = `Bearer ${token}`;
        return api(config);
      } catch (refreshErr) {
        // A network blip during refresh should not log the admin out;
        // a rejected/missing refresh token should.
        if (refreshErr?.response || refreshErr?.noRefreshToken) handleAuthFailure('session');
        return Promise.reject(err);
      }
    }

    if (response.status === 403 && resolveErrorCode(err) === 'ADMIN_ACCESS_REQUIRED') {
      handleAuthFailure('adminOnly');
    }

    return Promise.reject(err);
  },
);

export default api;
