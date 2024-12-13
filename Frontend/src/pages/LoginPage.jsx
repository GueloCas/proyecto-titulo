import React, { useState } from 'react';
import { login } from '../api/auth.api';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const handleLogin = async (username, password) => {
       setLoading(true);
       setError('');

       const response = await login(username, password);

       if (response.success) {
           navigate('/inversores');
       } else {
           setError('Credenciales incorrectas');
       }

       setLoading(false);
   };

   return (
       <div className="container d-flex justify-content-center align-items-center min-vh-100">
           <div className="col-12 col-md-6 col-lg-4">
               <div className="card shadow-lg" style={{ backgroundColor: '#1E3A5F' }}>
                   <div className="card-body">
                       <h2 className="text-center mb-4 text-white">Iniciar sesión</h2>
                       {error && <div className="alert alert-danger">{error}</div>}
                       <LoginForm onLogin={handleLogin} loading={loading} />
                       <div className="text-center mt-3">
                           <p className='text-white'>¿No tienes una cuenta? <Link to="/register">Regístrate</Link></p>
                       </div>
                   </div>
               </div>
           </div>
       </div>
   );
}
