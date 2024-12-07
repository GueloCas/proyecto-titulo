import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const getInversores =  () => api.get('inversor/').then(response => response.data);
export const getInversoresByUser = () => api.get("inversoresByUser/").then((response) => response.data);
export const createInversor =  (inversor) => api.post('inversores/', inversor).then(response => response.data);
export const deleteInversor =  (id) => api.delete(`inversor/${id}/`).then(response => response.data);





