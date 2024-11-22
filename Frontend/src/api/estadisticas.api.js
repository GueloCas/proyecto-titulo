import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    });

export const getMetricasEstacionHoraMes = (id, hora) => api.get(`metricas-estacion-hora-mes/?estacion=${id}&hora=${hora}`).then(response => response.data);
export const getMetricasEstacionGeneralMes = (id) => api.get(`metricas-estacion-general-mes/?estacion=${id}`).then(response => response.data);
export const getMetricasEstacionGeneralDia = (id, dia) => api.get(`metricas-estacion-general-dia/?estacion=${id}&dia=${dia}`).then(response => response.data);
export const getMetricasEstacionHoraDia = (id, dia, hora) => api.get(`metricas-estacion-hora-dia/?estacion=${id}&dia=${dia}&hora=${hora}`).then(response => response.data);

