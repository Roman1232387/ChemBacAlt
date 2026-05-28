import axios from 'axios';

const TOKEN_KEY = 'chem_bac_token';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5188/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        if (error.response?.status === 500) {
            console.error('Server error (500):', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
