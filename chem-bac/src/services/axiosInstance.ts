import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5188/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
                window.location.href = '/login';
            }
        }
        
        if (error.response?.data?.message) {
            error.message = error.response.data.message;
        }

        if (error.response?.status === 500) {
            console.error('Server error (500):', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
