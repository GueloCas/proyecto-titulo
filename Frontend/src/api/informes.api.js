import api from './root.api';

export const getDatosInformeInversor = (id, anio, mes) => api.get(`informe-inversor/?inversor=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);
export const getDatosInformeEstacion = (id, anio, mes) => api.get(`informe-estacion/?estacion=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);