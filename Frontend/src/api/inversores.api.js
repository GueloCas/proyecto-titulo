import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
});

export const getInversores =  () => api.get('inversor/').then(response => response.data);
export const getProduccionPorInversor = (id) => api.get(`produccion-por-inversor/?inversor_id=${id}`).then(response => response.data);
export const getProduccionPorInversorGrados = (id) => api.get(`produccion-por-inversor-grados/?inversor_id=${id}`).then(response => response.data);
export const getProduccionPorInversorEstadisticas = (id) => api.get(`produccion-por-inversor-estadisticas/?inversor_id=${id}`).then(response => response.data);
export const getProduccionPorInversorHora = (id, hora) => api.get(`produccion-por-inversor-hora/?inversor_id=${id}&hora=${hora}`).then(response => response.data);
export const getMinMaxHora = (id, hora) => api.get(`min-max-hora/?inversor_id=${id}&hora=${hora}`).then(response => response.data);
export const getProduccionVLinguisticas = (valor, min, max) => api.get(`variable-linguistica-hora/?valor=${valor}&min=${min}&max=${max}`).then(response => response.data);
export const getPercepcionesComputacionales = (dia, hora) => api.get(`percepciones-computacionales/?dia=${dia}&hora=${hora}`).then(response => response.data);
export const getPercepcionesComputacionalesDia = (dia) => api.get(`percepciones-computacionales-dia/?dia=${dia}`).then(response => response.data);
export const createInversor =  (inversor) => api.post('inversores/', inversor).then(response => response.data);