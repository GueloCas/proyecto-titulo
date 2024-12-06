import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../api/users.api";
import Swal from "sweetalert2";

export function CambiarContraForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await updatePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_new_password: data.confirmNewPassword,
      });
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Contraseña actualizada exitosamente",
      });
      navigate("/estaciones");
    } catch (error) {
      console.error("Error al actualizar la contraseña", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la contraseña. Verifique los datos.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="currentPassword" className="form-label">Contraseña actual</label>
        <input
          type="password"
          className="form-control"
          id="currentPassword"
          {...register("currentPassword", { required: "La contraseña actual es obligatoria" })}
        />
        {errors.currentPassword && <small className="text-danger">{errors.currentPassword.message}</small>}
      </div>

      <div className="mb-3">
        <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
        <input
          type="password"
          className="form-control"
          id="newPassword"
          {...register("newPassword", { 
            required: "La nueva contraseña es obligatoria",
            minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
          })}
        />
        {errors.newPassword && <small className="text-danger">{errors.newPassword.message}</small>}
      </div>

      <div className="mb-3">
        <label htmlFor="confirmNewPassword" className="form-label">Confirmar nueva contraseña</label>
        <input
          type="password"
          className="form-control"
          id="confirmNewPassword"
          {...register("confirmNewPassword", { 
            required: "Debe confirmar la nueva contraseña",
            validate: (value) => value === watch("newPassword") || "Las contraseñas no coinciden",
          })}
        />
        {errors.confirmNewPassword && <small className="text-danger">{errors.confirmNewPassword.message}</small>}
      </div>

      <div className="d-grid gap-2">
        <button type="submit" className="btn btn-primary">Actualizar contraseña</button>
      </div>
    </form>
  );
}
