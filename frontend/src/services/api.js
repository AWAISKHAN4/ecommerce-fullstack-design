import axios from 'axios';

/**
 * Axios instance configured for the eCommerce API
 * Base URL reads from Vite environment variable or defaults to localhost
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ecommerce-fullstack-design-i0fp.onrender.com',
  timeout: 10000,
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (token expired / unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// ── Products ──────────────────────────────
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getCategories: () => API.get('/products/categories'),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

// ── Cart ──────────────────────────────────
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productId, quantity) => API.post('/cart', { productId, quantity }),
  update: (itemId, quantity) => API.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId) => API.delete(`/cart/${itemId}`),
  clear: () => API.delete('/cart/clear'),
};

export default API;
