import api from './root.api';

export const getInversores =  () => api.get('inversor/').then(response => response.data);
export const getInversoresByUser = () => api.get("inversoresByUser/").then((response) => response.data);
export const createInversor =  (inversor) => api.post('inversores/', inversor).then(response => response.data);
export const deleteInversor =  (id) => api.delete(`inversor/${id}/`).then(response => response.data);





