import api from './root.api';

export const getUser = (id) => api.get(`user/${id}/`).then((response) => response.data);
export const updatePassword = (passwordData) => api.post("user/change-password/",passwordData,).then((response) => response.data);
export const updateUsername = (usernameData) => api.post("user/update-username/",usernameData,).then((response) => response.data);
