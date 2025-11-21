import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
};

export const clientsAPI = {
  getAll: (search?: string) =>
    api.get('/clients', { params: { search } }),
  getById: (id: number) => api.get(`/clients/${id}`),
  create: (data: any) => api.post('/clients', data),
  update: (id: number, data: any) => api.put(`/clients/${id}`, data),
  delete: (id: number) => api.delete(`/clients/${id}`),
};

export const interventionsAPI = {
  getAll: (filters?: any) => api.get('/interventions', { params: filters }),
  getById: (id: number) => api.get(`/interventions/${id}`),
  create: (data: any) => api.post('/interventions', data),
  update: (id: number, data: any) => api.put(`/interventions/${id}`, data),
  delete: (id: number) => api.delete(`/interventions/${id}`),
};

export const inventoryAPI = {
  getAll: (search?: string, lowStock?: boolean) =>
    api.get('/inventory', { params: { search, low_stock: lowStock } }),
  getLowStock: () => api.get('/inventory/low-stock'),
  getById: (id: number) => api.get(`/inventory/${id}`),
  create: (data: any) => api.post('/inventory', data),
  update: (id: number, data: any) => api.put(`/inventory/${id}`, data),
  delete: (id: number) => api.delete(`/inventory/${id}`),
};

export const statisticsAPI = {
  getOverview: () => api.get('/statistics'),
  getMonthlyRevenue: () => api.get('/statistics/monthly-revenue'),
  getByType: () => api.get('/statistics/interventions-by-type'),
};

export const pdfAPI = {
  generate: (id: number) => api.get(`/pdf/${id}`, { responseType: 'blob' }),
};

export default api;
