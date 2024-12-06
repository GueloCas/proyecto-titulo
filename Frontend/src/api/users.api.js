import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const getUsers = () => api.get("user/").then((response) => response.data);
export const getUser = (id) => api.get(`user/${id}/`).then((response) => response.data);
export const createUser = (user) => api.post("user/", user).then((response) => response.data);
export const updateUser = (user) => api.put(`user/${user.id}/`, user).then((response) => response.data);
export const deleteUser = (id) => api.delete(`user/${id}/`).then((response) => response.data);
export const updatePassword = (passwordData) => api.post("user/change-password/",passwordData,).then((response) => response.data);
