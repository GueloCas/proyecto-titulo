import { CambiarUserForm } from "../components/CambiarUserForm"
import { Link } from "react-router-dom"
import { Card } from "../components/Card"
import { CambiarContraForm } from "../components/CambiarContraForm";



export function EditarPerfilPage() {




    return (
      <div className="mt-4">
      <h4 className="ms-2">Editar perfil</h4>
      <div className="col mt-2">
          {/* Bloque de descripciones */}
          <div className="col-md-6 d-flex">
              <div className="card w-100 text-center">
                  <div className="card-body">
                      <h4 className="card-title mb-4">Cambiar Nombre de usuario</h4>
                    <CambiarUserForm />
                  </div>
              </div>
          </div>
          {/* Bloque del gráfico */}
          <div className="col-md-6 d-flex">
              <div className="card w-100 text-center">
                  <div className="card-body">
                      <h4 className="card-title mb-4">Cambiar contraseña</h4>
                      <CambiarContraForm />
                  </div>
              </div>
          </div>
      </div>
  </div>
      );
}