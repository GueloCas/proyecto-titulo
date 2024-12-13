import React, { useState } from 'react';

export function RegisterForm({ onRegister, loading }) {
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = (e) => {
       e.preventDefault();
       if (!username || !email || !password) {
           alert('Por favor complete todos los campos');
           return;
       }
       onRegister(username, email, password);
   };

   return (
       <form onSubmit={handleSubmit}>
           <div className="mb-3">
               <label htmlFor="username" className="form-label text-white">Nombre de usuario</label>
               <input
                   type="text"
                   className="form-control"
                   id="username"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   required
               />
           </div>
           <div className="mb-3">
               <label htmlFor="email" className="form-label text-white">Correo electrónico</label>
               <input
                   type="email"
                   className="form-control"
                   id="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
               />
           </div>
           <div className="mb-3">
               <label htmlFor="password" className="form-label text-white">Contraseña</label>
               <input
                   type="password"
                   className="form-control"
                   id="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
               />
           </div>
           <div className="d-grid gap-2">
               <button type="submit" className="btn btn-warning" disabled={loading}>
                   {loading ? 'Registrando...' : 'Registrarse'}
               </button>
           </div>
       </form>
   );
}
