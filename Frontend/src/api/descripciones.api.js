import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
});

export const getDescripcionesInversor = (id) => api.get(`descripciones-linguisticas-inversor/?inversor_id=${id}`).then(response => response.data);
export const getDescripcionesEstacion = (id) => api.get(`descripciones-linguisticas-estacion/?estacion_id=${id}`).then(response => response.data);
