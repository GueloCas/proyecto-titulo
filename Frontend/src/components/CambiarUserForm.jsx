import {React} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import { updateUser } from "../api/users.api";

export function CambiarUserForm() {

    const {register, handleSubmit} = useForm();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) {
                navigate('/login');
                return;
            }else{
                setUser(storedUser);
            }
        };
        fetchUser();
        console.log(user);
    }, []);

    const onSubmit = async (data) => {
        console.log("onsubmit",data);
        
        const response = await updateUser({
            id: user.id,
            username: data.username,
            password: user.password,
        });
        console.log(response.data);
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
            
            <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                    Guardar cambios
                </button>
            </div>
        </form>
    );
}

