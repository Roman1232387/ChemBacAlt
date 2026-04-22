import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5188/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor — handles errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 500) {
            console.error('Server error (500):', error.response.data);
            // You can later show a toast notification here
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
