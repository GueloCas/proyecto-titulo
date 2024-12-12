import api from './root.api';

export const getAnioByInversor = (id) => api.get(`filters/anio-by-inversor/?inversor=${id}`).then(response => response.data);
export const getMesByAnioInversor = (id,anio) => api.get(`filters/mes-by-anio-inversor/?inversor=${id}&anio=${anio}`).then(response => response.data);
export const getDiaByMesAnioInversor = (id,anio,mes) => api.get(`filters/dia-by-mes-anio-inversor/?inversor=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);
export const getHoraByMesAnioInversor = (id,anio,mes) => api.get(`filters/hora-by-mes-anio-inversor/?inversor=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);
export const getHoraByDiaMesAnioInversor = (id,anio,mes,dia) => api.get(`filters/hora-by-dia-mes-anio-inversor/?inversor=${id}&anio=${anio}&mes=${mes}&dia=${dia}`).then(response => response.data);

export const getAnioByEstacion = (id) => api.get(`filters/anio-by-estacion/?estacion=${id}`).then(response => response.data);
export const getMesByAnioEstacion = (id,anio) => api.get(`filters/mes-by-anio-estacion/?estacion=${id}&anio=${anio}`).then(response => response.data);
export const getDiaByMesAnioEstacion = (id,anio,mes) => api.get(`filters/dia-by-mes-anio-estacion/?estacion=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);
export const getHoraByMesAnioEstacion = (id,anio,mes) => api.get(`filters/hora-by-mes-anio-estacion/?estacion=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);
export const getHoraByDiaMesAnioEstacion = (id,anio,mes,dia) => api.get(`filters/hora-by-dia-mes-anio-estacion/?estacion=${id}&anio=${anio}&mes=${mes}&dia=${dia}`).then(response => response.data);
