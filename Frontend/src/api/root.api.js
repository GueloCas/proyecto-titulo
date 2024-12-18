import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default api;