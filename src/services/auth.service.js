import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  const { accessToken, user } = data.data;

  if (user.role !== 'admin') {
    throw new Error('Access denied. Admin accounts only.');
  }

  localStorage.setItem('admin_token', accessToken);
  localStorage.setItem('admin_user', JSON.stringify(user));
  return user;
};

export const logout = async () => {
  try { await api.post('/auth/logout'); } catch (_) {}
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
