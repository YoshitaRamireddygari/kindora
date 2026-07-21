import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const donorService = {
    createDonation: (data) => api.post('/donor/donation', data),
    getHistory: (donorId) => api.get(`/donor/history/${donorId}`),
};

export const ngoService = {
    register: (data) => api.post('/ngo/register', data),
};

export default api;
