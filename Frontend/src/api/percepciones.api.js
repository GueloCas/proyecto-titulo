import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
});

export const getMinMaxHora = (id, hora) => api.get(`min-max-hora/?inversor_id=${id}&hora=${hora}`).then(response => response.data);
export const getProduccionVLinguisticas = (valor, min, max) => api.get(`variable-linguistica-hora/?valor=${valor}&min=${min}&max=${max}`).then(response => response.data);
export const getPercepcionesSegundoGradoDiaHora = (estacion, dia, hora) => api.get(`percepciones-segundo-grado-dia-hora/?estacion=${estacion}&dia=${dia}&hora=${hora}`).then(response => response.data);
export const getPercepcionesSegundoGradoDia = (estacion, dia) => api.get(`percepciones-segundo-grado-dia/?estacion=${estacion}&dia=${dia}`).then(response => response.data);
export const getPercepcionesPrimerGradoDia = (inversor, dia) => api.get(`percepciones-primer-grado-dia/?inversor=${inversor}&dia=${dia}`).then(response => response.data);
export const getPercepcionesPrimerGradoHora = (inversor, hora) => api.get(`percepciones-primer-grado-hora/?inversor=${inversor}&hora=${hora}`).then(response => response.data);