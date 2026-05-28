import axios from 'axios';

const TOKEN_KEY = 'chem_bac_token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5188/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
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

export default axiosInstance;
