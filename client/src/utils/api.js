import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or it's a retry request, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If we're already refreshing the token, add the request to the queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Try to refresh the token
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh-token`,
        {},
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { accessToken } = response.data;
      
      // Update the token in localStorage
      localStorage.setItem('token', accessToken);
      
      // Update the Authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Process the queue
      processQueue(null, accessToken);
      
      // Retry the original request
      return api(originalRequest);
    } catch (error) {
      // If refresh fails, clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      processQueue(error, null);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

// Helper function to handle errors
const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || 
                     error.message || 
                     'Something went wrong';
  console.error('API Error:', errorMessage);
  return Promise.reject(new Error(errorMessage));
};

// Auth API methods
export const auth = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user, refreshToken } = response.data;
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      return { user };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  signup: async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { accessToken, user, refreshToken } = response.data;
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      return { user };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  },
  
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Tasks API methods
export const tasks = {
  getAll: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  create: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  update: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default api;
