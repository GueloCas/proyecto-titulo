import api from './root.api';

export const getProduccionPorInversor = (id, anio, mes) => api.get(`produccion-por-inversor/?inversor_id=${id}&anio=${anio}&mes=${mes}`).then(response => response.data);