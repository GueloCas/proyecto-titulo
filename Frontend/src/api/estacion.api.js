import api from './root.api';

export const getEstaciones = () => api.get("estacion/").then((response) => response.data);
export const getEstacionesByUser = () => api.get("estacionesByUser/").then((response) => response.data);
export const getEstacion = (id) => api.get(`estacion/${id}/`).then((response) => response.data);
export const createEstacion = (estacion) =>
    api.post("estacion/", estacion).then((response) => response.data);
export const deleteEstacion = (id) =>
    api.delete(`estacion/${id}/`).then((response) => response.data);