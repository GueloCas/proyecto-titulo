import { React } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import { updateUser } from "../api/users.api";
import { reloadUserStorage } from "../context/AuthContext";

export function CambiarUserForm() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            console.log(storedUser);
            if (!storedUser) {
                navigate('/login');
                return;
            } else {
                setUser(storedUser);
            }
        };
        fetchUser();
    }, []);

    const onSubmit = async (data) => {
        // Muestra la alerta de confirmación
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `Estás a punto de cambiar tu nombre de usuario a "${data.username}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar",
        });

        // Si el usuario confirma, procede con la actualización
        if (result.isConfirmed) {

            const response = await updateUser({
                id: user.id,
                username: data.username,
                email: user.email,
            });

            reloadUserStorage({ id: user.id });

            // Muestra un mensaje de éxito
            Swal.fire({
                title: "¡Actualización exitosa!",
                text: "Tu nombre de usuario ha sido cambiado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label htmlFor="username" className="form-label">
                    Nombre de usuario
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    defaultValue={user?.username}
                    {...register("username")}
                    required
                />
                <label htmlFor="email" className="form-label mt-2">
                    Email de usuario
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="email"
                    defaultValue={user?.email}
                    disabled
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
