import api from './api';

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadImage = async (file, folder = 'localtrip') => {
  const formData = new FormData();
  formData.append('image', file);
  const r = await api.post(`/admin/upload?folder=${folder}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return r.data.data.url;
};

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

// ─── Trips ────────────────────────────────────────────────────────────────────
export const fetchTrips = (params = {}) =>
  api.get('/admin/trips', { params }).then((r) => r.data.data);

export const fetchTripById = (id) =>
  api.get(`/admin/trips/${id}`).then((r) => r.data.data);

export const updateTrip = (id, body) =>
  api.put(`/admin/trips/${id}`, body).then((r) => r.data.data);

export const deleteTrip = (id) =>
  api.delete(`/admin/trips/${id}`).then((r) => r.data.data);

// ─── Restaurants (Eat & Drink) ────────────────────────────────────────────────
export const fetchRestaurants = (params = {}) =>
  api.get('/admin/restaurants', { params }).then((r) => r.data.data);

export const createRestaurant = (body) =>
  api.post('/admin/restaurants', body).then((r) => r.data.data);

export const updateRestaurant = (id, body) =>
  api.put(`/admin/restaurants/${id}`, body).then((r) => r.data.data);

export const deleteRestaurant = (id) =>
  api.delete(`/admin/restaurants/${id}`).then((r) => r.data);

// ─── Events ───────────────────────────────────────────────────────────────────
export const fetchEvents = (params = {}) =>
  api.get('/admin/events', { params }).then((r) => r.data.data);

export const createEvent = (body) =>
  api.post('/admin/events', body).then((r) => r.data.data);

export const updateEvent = (id, body) =>
  api.put(`/admin/events/${id}`, body).then((r) => r.data.data);

export const deleteEvent = (id) =>
  api.delete(`/admin/events/${id}`).then((r) => r.data);

// ─── Users ────────────────────────────────────────────────────────────────────
export const fetchUsers = (params = {}) =>
  api.get('/admin/users', { params }).then((r) => r.data.data);

// ─── Categories ───────────────────────────────────────────────────────────────
export const fetchCategories = (params = {}) =>
  api.get('/admin/categories', { params }).then((r) => r.data.data);

export const createCategory = (body) =>
  api.post('/admin/categories', body).then((r) => r.data.data);

export const updateCategory = (id, body) =>
  api.put(`/admin/categories/${id}`, body).then((r) => r.data.data);

export const deleteCategory = (id) =>
  api.delete(`/admin/categories/${id}`).then((r) => r.data);

// ─── Carousel ─────────────────────────────────────────────────────────────────
export const fetchCarousel = () =>
  api.get('/admin/carousel').then((r) => r.data.data);

export const createCarouselItem = (body) =>
  api.post('/admin/carousel', body).then((r) => r.data.data);

export const updateCarouselItem = (id, body) =>
  api.put(`/admin/carousel/${id}`, body).then((r) => r.data.data);

export const deleteCarouselItem = (id) =>
  api.delete(`/admin/carousel/${id}`).then((r) => r.data);
