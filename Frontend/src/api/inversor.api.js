import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
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

export const getInversores =  () => api.get('inversor/').then(response => response.data);
export const getInversoresByUser = () => api.get("inversoresByUser/").then((response) => response.data);
export const createInversor =  (inversor) => api.post('inversores/', inversor).then(response => response.data);
export const deleteInversor =  (id) => api.delete(`inversor/${id}/`).then(response => response.data);





