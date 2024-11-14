import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    });

export const getEstaciones = () => api.get("estacion/").then(response => response.data);
export const createEstacion = (estacion) => api.post("estacion/", estacion).then(response => response.data);
export const deleteEstacion = (id) => api.delete(`estacion/${id}/`).then(response => response.data);