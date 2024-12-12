import api from './root.api';

export const login = async (username, password) => {
    try {
        const response = await api.post('login/', { username, password });
        const { status, data } = response;

        if (status === 200) {
            // Guardar el token y la información del usuario en el localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Configurar el header de Authorization en Axios con el token
            api.defaults.headers.common['Authorization'] = `Token ${data.token}`;

            return { success: true, user: data.user };
        }
    } catch (error) {
        console.error('Error en el login:', error);
        return { success: false, error: error.message };
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await api.post('register/', { username, email, password });
        const { status, data } = response;

        if (status === 201) {
            // Guardar el token y la información del usuario en el localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Configurar el header de Authorization en Axios con el token
            api.defaults.headers.common['Authorization'] = `Token ${data.token}`;

            return { success: true, user: data.user };
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        return { success: false, error: error.message };
    }
}

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
};