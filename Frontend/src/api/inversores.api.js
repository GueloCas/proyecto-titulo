import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
});

export const getInversores =  () => api.get('inversor/').then(response => response.data);
export const getProduccionPorInversor = (id, hora) => {
    const url = hora 
        ? `produccion-por-inversor/?inversor_id=${id}&hora=${hora}` 
        : `produccion-por-inversor/?inversor_id=${id}`;
    
    return api.get(url).then(response => response.data);
};
export const createInversor =  (inversor) => api.post('inversores/', inversor).then(response => response.data);