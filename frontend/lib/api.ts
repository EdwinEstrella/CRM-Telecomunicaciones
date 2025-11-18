import axios from 'axios';

/**
 * API Configuration
 * 
 * Uses relative paths to Next.js API routes
 * All API endpoints are now handled by Next.js API routes
 */
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // Timeout de 10 segundos para evitar requests colgados
});

// Request interceptor para agregar timestamp y evitar cache de requests
api.interceptors.request.use(
  (config) => {
    // Agregar timestamp para evitar cache en GET requests
    if (config.method === 'get' && !config.params) {
      config.params = {};
    }
    if (config.method === 'get' && config.params) {
      config.params._t = Date.now();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

