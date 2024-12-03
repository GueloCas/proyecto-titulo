import {React} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";

export function EditarPerfilForm() {

    const {register, handleSubmit} = useForm();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios.get('http://localhost:3001/api/user');
            setUser(response.data);
        };
        fetchUser();
    }, []);

    const onSubmit = async (data) => {
        console.log(data);
        const response = await axios.put('http://localhost:3001/api/user', data);
        console.log(response.data);
        navigate('/inversores');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Nombre de usuario</label>
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    defaultValue={user?.username}
                    {...register('username')}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    defaultValue={user?.email}
                    {...register('email')}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...register('password')}
                    required
                />
            </div>
            <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                    Guardar cambios
                </button>
            </div>
        </form>
    );
}

