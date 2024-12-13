import React, { useState } from 'react';

export function LoginForm({ onLogin, loading }) {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = (e) => {
       e.preventDefault();
       if (!username || !password) {
           alert('Por favor ingrese tanto el nombre de usuario como la contraseña');
           return;
       }
       onLogin(username, password);
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
                   {loading ? 'Cargando...' : 'Iniciar sesión'}
               </button>
           </div>
       </form>
   );
}
