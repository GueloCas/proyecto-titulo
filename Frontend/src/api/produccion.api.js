import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
});

export const getProduccionPorInversor = (id, anio, mes) => api.get(`produccion-por-inversor/?inversor_id=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);
export const getProduccionPorInversorGrados = (id) => api.get(`produccion-por-inversor-grados/?inversor_id=${id}`).then(response => response.data);
export const getProduccionPorInversorEstadisticas = (id) => api.get(`produccion-por-inversor-estadisticas/?inversor_id=${id}`).then(response => response.data);
export const getProduccionPorInversorHora = (id, hora) => api.get(`produccion-por-inversor-hora/?inversor_id=${id}&hora=${hora}`).then(response => response.data);