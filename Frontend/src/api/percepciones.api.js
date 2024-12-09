import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
});

export const getMinMaxHora = (id, hora) => api.get(`min-max-hora/?inversor_id=${id}&hora=${hora}`).then(response => response.data);
export const getPercepcionesPrimerGrado = (id, anio, mes, dia, hora) => api.get(`variable-linguistica-hora/?inversor=${id}&anio=${anio}&mes=${mes}&dia=${dia}&hora=${hora}`).then(response => response.data);
export const getPercepcionesSegundoGradoDiaHora = (estacion, anio, mes, dia, hora) => api.get(`percepciones-segundo-grado-dia-hora/?estacion=${estacion}&anio=${anio}&mes=${mes}&dia=${dia}&hora=${hora}`).then(response => response.data);
export const getPercepcionesSegundoGradoDia = (estacion, anio, mes, dia) => api.get(`percepciones-segundo-grado-dia/?estacion=${estacion}&anio=${anio}&mes=${mes}&dia=${dia}`).then(response => response.data);
export const getPercepcionesPrimerGradoDia = (inversor, anio, mes, dia) => api.get(`percepciones-primer-grado-dia/?inversor=${inversor}&anio=${anio}&mes=${mes}&dia=${dia}`).then(response => response.data);
export const getPercepcionesPrimerGradoHora = (inversor, anio, mes, hora) => api.get(`percepciones-primer-grado-hora/?inversor=${inversor}&anio=${anio}&mes=${mes}&hora=${hora}`).then(response => response.data);