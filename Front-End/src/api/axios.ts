import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

export const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Unauthenticated or token expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const employeesApi = {
    list: () => api.get('/employees'),
    getById: (id: number) => api.get(`/employees/${id}`),
    create: (payload: Record<string, unknown>) => api.post('/employees', payload),
    update: (id: number, payload: Record<string, unknown>) => api.put(`/employees/${id}`, payload),
    remove: (id: number) => api.delete(`/employees/${id}`),
    listInstructors: () => api.get('/employees/instructors'),
};

export const shiftsApi = {
    list: (params?: Record<string, unknown>) => api.get('/shifts', { params }),
    getById: (id: number) => api.get(`/shifts/${id}`),
    available: (params?: Record<string, unknown>) => api.get('/shifts/available', { params }),
    create: (payload: Record<string, unknown>) => api.post('/shifts', payload),
    update: (id: number, payload: Record<string, unknown>) => api.put(`/shifts/${id}`, payload),
    remove: (id: number) => api.delete(`/shifts/${id}`),
};

export const reservationsApi = {
    list: (params?: Record<string, unknown>) => api.get('/reservations', { params }),
    create: (turno_id: number) => api.post('/reservations', { turno_id }),
    confirm: (id: number) => api.put(`/reservations/${id}/confirm`),
    cancel: (id: number, motivo?: string) => api.put(`/reservations/${id}/cancel`, { motivo }),
};

export const progressApi = {
    myList: () => api.get('/my-progress'),
    latest: () => api.get('/my-progress/latest'),
    history: (limit = 10) => api.get('/my-progress/history', { params: { limit } }),
    create: (payload: { fecha: string; peso?: number; observaciones?: string }) => api.post('/progress', payload),
    update: (id: number, payload: { fecha?: string; peso?: number; observaciones?: string }) => api.put(`/progress/${id}`, payload),
    remove: (id: number) => api.delete(`/progress/${id}`),
};
