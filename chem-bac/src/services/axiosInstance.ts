import axios from 'axios';

const TOKEN_KEY = 'chem_bac_token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const isTokenValid = (token: string): boolean => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return false;

        const parsed = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
        return !parsed.exp || parsed.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && isTokenValid(token)) {
        config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
        localStorage.removeItem(TOKEN_KEY);
        delete config.headers.Authorization;
    }

    return config;
});

export default axiosInstance;
