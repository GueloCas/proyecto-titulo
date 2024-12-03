import axios from "axios";

// Configuración de Axios
const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
});

// Interceptor para agregar el ID al encabezado
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem("user"); // Obtén el usuario del localStorage
        if (user) {
            const userObj = JSON.parse(user); // Parsear el objeto JSON
            console.log("User ID:", userObj.id);
            config.headers["User-ID"] = userObj.id; // Agregar el ID en el encabezado
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getEstaciones = () => api.get("estacion/").then((response) => response.data);
export const getEstacionesByUser = () => api.get("estacionesByUser/").then((response) => response.data);
export const getEstacion = (id) => api.get(`estacion/${id}/`).then((response) => response.data);
export const createEstacion = (estacion) =>
    api.post("estacion/", estacion).then((response) => response.data);
export const deleteEstacion = (id) =>
    api.delete(`estacion/${id}/`).then((response) => response.data);