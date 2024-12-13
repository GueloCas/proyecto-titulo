import React, { useState } from 'react';
import { register } from '../api/auth.api';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const handleRegister = async (username, email, password) => {
       setLoading(true);
       setError('');

       const response = await register(username, email, password);

       if (response.success) {
           navigate('/inversores');
       } else {
           setError('Error al registrar. Inténtalo de nuevo.');
       }

       setLoading(false);
   };

   return (
       <div className="container d-flex justify-content-center align-items-center min-vh-100">
           <div className="col-12 col-md-6 col-lg-4">
               <div className="card shadow-lg" style={{ backgroundColor: '#1E3A5F' }}>
                   <div className="card-body">
                       <h2 className="text-center mb-4 text-white">Registrarse</h2>
                       {error && <div className="alert alert-danger">{error}</div>}
                       <RegisterForm onRegister={handleRegister} loading={loading} />
                       <div className="text-center mt-3">
                           <p className='text-white'>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
                       </div>
                   </div>
               </div>
           </div>
       </div>
   );
}
