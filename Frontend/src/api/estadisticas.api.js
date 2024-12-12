import api from './root.api';

export const getMetricasEstacionHoraMes = (id, anio, mes, hora) => api.get(`metricas-estacion-hora-mes/?estacion=${id}&anio=${anio}&mes=${mes}&hora=${hora}`).then(response => response.data);
export const getMetricasEstacionGeneralMes = (id, anio, mes) => api.get(`metricas-estacion-general-mes/?estacion=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);
export const getMetricasEstacionGeneralDia = (id, anio, mes, dia) => api.get(`metricas-estacion-general-dia/?estacion=${id}&anio=${anio}&mes=${mes}&dia=${dia}`).then(response => response.data);
export const getMetricasEstacionHoraDia = (id, anio, mes, dia, hora) => api.get(`metricas-estacion-hora-dia/?estacion=${id}&anio=${anio}&mes=${mes}&dia=${dia}&hora=${hora}`).then(response => response.data);

export const getMetricasInversorMes = (id, anio, mes) => api.get(`metricas-inversor-mes/?inversor=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);

