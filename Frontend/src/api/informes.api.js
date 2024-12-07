import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
});

export const getDatosInformeInversor = (id, anio, mes) => api.get(`informe-inversor/?inversor=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);
export const getDatosInformeEstacion = (id, anio, mes) => api.get(`informe-estacion/?estacion=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);