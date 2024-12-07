import axios from "axios";

// Configuración de Axios
const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const getEstaciones = () => api.get("estacion/").then((response) => response.data);
export const getEstacionesByUser = () => api.get("estacionesByUser/").then((response) => response.data);
export const getEstacion = (id) => api.get(`estacion/${id}/`).then((response) => response.data);
export const createEstacion = (estacion) =>
    api.post("estacion/", estacion).then((response) => response.data);
export const deleteEstacion = (id) =>
    api.delete(`estacion/${id}/`).then((response) => response.data);