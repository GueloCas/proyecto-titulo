import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
});

export const getDatosInformeInversor = (id) => api.get(`informe-inversor/?inversor=${id}`).then(response => response.data);