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
    changePassword: (data) => api.post('/auth/change-password', data)
};

export const donorService = {
    createDonation: (data) => api.post('/donor/donation', data),
    getHistory: (donorId) => api.get(`/donor/history/${donorId}`),
    getDashboardStats: (donorId) => api.get(`/donor/dashboard-stats/${donorId}`),
    trackDonation: (id) => api.get(`/donor/donation/${id}`),
};

export const ngoService = {
    register: (data) => api.post('/ngo/register', data),
    getPendingDonations: () => api.get('/ngo/donations/pending'),
    getAcceptedDonations: (ngoId) => api.get(`/ngo/donations/accepted/${ngoId}`),
    acceptDonation: (donationId, ngoId) => api.post(`/ngo/donations/${donationId}/accept?ngoId=${ngoId}`),
    getDashboardStats: (ngoId) => api.get(`/ngo/dashboard-stats/${ngoId}`),
    getInventory: (ngoId) => api.get(`/ngo/inventory/${ngoId}`),
    updateDonationStatus: (donationId, status) => api.post(`/ngo/donations/${donationId}/status?status=${status}`),
};

export const adminService = {
    getDashboardStats: () => api.get('/admin/dashboard'),
    getPendingNgos: () => api.get('/admin/ngos/pending'),
    approveNgo: (id) => api.post(`/admin/ngos/${id}/approve`),
    rejectNgo: (id, reason) => api.post(`/admin/ngos/${id}/reject`, { reason }),
    getUsers: () => api.get('/admin/users'),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getDonations: () => api.get('/admin/donations'),
};

export default api;
