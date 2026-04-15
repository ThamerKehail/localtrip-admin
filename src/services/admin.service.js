import api from './api';

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const fetchStats = () =>
  api.get('/admin/stats').then((r) => r.data.data);

// ─── Destinations ─────────────────────────────────────────────────────────────
export const fetchDestinations = (params = {}) =>
  api.get('/admin/destinations', { params }).then((r) => r.data.data);

export const createDestination = (body) =>
  api.post('/admin/destinations', body).then((r) => r.data.data);

export const updateDestination = (id, body) =>
  api.put(`/admin/destinations/${id}`, body).then((r) => r.data.data);

export const deleteDestination = (id) =>
  api.delete(`/admin/destinations/${id}`).then((r) => r.data);

// ─── Guides ───────────────────────────────────────────────────────────────────
export const fetchGuides = (params = {}) =>
  api.get('/admin/guides', { params }).then((r) => r.data.data);

export const updateGuideStatus = (id, status) =>
  api.put(`/admin/guides/${id}/status`, { status }).then((r) => r.data.data);

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const fetchBookings = (params = {}) =>
  api.get('/admin/bookings', { params }).then((r) => r.data.data);

// ─── Users ────────────────────────────────────────────────────────────────────
export const fetchUsers = (params = {}) =>
  api.get('/admin/users', { params }).then((r) => r.data.data);
