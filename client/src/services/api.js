import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pandit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for unified error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please check your connection.';
    return Promise.reject(new Error(message));
  }
);

/**
 * Health check ping to server
 */
export const checkServerHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

/**
 * Auth API
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

/**
 * Rituals API
 */
export const getRituals = async (params = {}) => {
  const response = await api.get('/rituals', { params });
  return response.data;
};

export const getRitualDetails = async (idOrSlug) => {
  const response = await api.get(`/rituals/${idOrSlug}`);
  return response.data;
};

/**
 * Priests API
 */
export const getPriests = async (params = {}) => {
  const response = await api.get('/priests', { params });
  return response.data;
};

export const getPriestDetails = async (id) => {
  const response = await api.get(`/priests/${id}`);
  return response.data;
};

export const getFeaturedPriests = async () => {
  const response = await api.get('/priests/featured');
  return response.data;
};

/**
 * Bookings API
 */
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/my-bookings');
  return response.data;
};

export const getPriestBookings = async () => {
  const response = await api.get('/bookings/priest-bookings');
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.put(`/bookings/${id}/status`, { status });
  return response.data;
};

/**
 * Reviews API
 */
export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const getPriestReviews = async (priestId) => {
  const response = await api.get(`/reviews/priest/${priestId}`);
  return response.data;
};

/**
 * Database Seeder
 */
export const seedDatabase = async () => {
  const response = await api.post('/seed');
  return response.data;
};

export default api;
