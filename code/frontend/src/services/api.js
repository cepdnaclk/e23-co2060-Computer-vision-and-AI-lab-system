import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
};

// Equipment
export const equipmentAPI = {
  getAll: (params) => API.get('/equipment', { params }),
  getCategories: () => API.get('/equipment/categories'),
  getById: (id) => API.get(`/equipment/${id}`),
  checkAvailability: (id, start, end) => API.get(`/equipment/${id}/availability`, { params: { start, end } }),
  create: (data) => API.post('/equipment', data),
  update: (id, data) => API.put(`/equipment/${id}`, data),
};

// Bookings
export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getMy: (params) => API.get('/bookings/my', { params }),
  getById: (id) => API.get(`/bookings/${id}`),
  cancel: (id) => API.put(`/bookings/${id}/cancel`),
  getAll: (params) => API.get('/bookings', { params }),
  approve: (id) => API.put(`/bookings/${id}/approve`),
  reject: (id, reason) => API.put(`/bookings/${id}/reject`, { reason }),
  markPickedUp: (id) => API.put(`/bookings/${id}/pickup`),
  markReturned: (id, condition_note) => API.put(`/bookings/${id}/return`, { condition_note }),
  lookupByRef: (ref) => API.get(`/bookings/lookup/${ref}`),
};

// Dashboard stats
export const statsAPI = {
  getDashboard: () => API.get('/dashboard/stats'),
};

// Notifications
export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  markRead: (id) => API.put(`/notifications/${id}/read`),
};

export default API;

// User profile
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  getAllUsers: (params) => API.get('/users', { params }),
};