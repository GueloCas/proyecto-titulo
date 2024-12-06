// AuthProvider.jsx
import { createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../api/users.api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ruta actual

  const user = JSON.parse(localStorage.getItem('user')) || '';
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    const publicRoutes = ['/', '/login']; // Lista de rutas públicas

    if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
      // Solo redirige si la ruta no es pública
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export async function reloadUserStorage({ id }) {
  console.log('id: ', id);

  try {
    const data = await getUser(id); // Esperar a que la promesa se resuelva
    console.log('reloadUserStorage', data);

    // Actualizar la información del usuario en el localStorage
    localStorage.setItem('user', JSON.stringify(data));
  } catch (error) {
    console.error('Error al cargar el usuario:', error);
  }
}