import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
});

export const getInversores =  () => api.get('inversor/').then(response => response.data);
export const getProduccionPorInversor =  (id) => api.get(`produccion-por-inversor/?inversor_id=${id}`).then(response => response.data);
export const createInversor =  (inversor) => api.post('inversores/', inversor).then(response => response.data);