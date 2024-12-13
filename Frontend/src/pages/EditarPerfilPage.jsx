import { CambiarUserForm } from "../components/CambiarUserForm"
import { CambiarContraForm } from "../components/CambiarContraForm";
import { Link } from "react-router-dom";

export function EditarPerfilPage() {
    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h1 className="mb-0 fw-bold">Editar Perfil</h1>
                </div>

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item">
                            <Link to="/editar-perfil">Perfil</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Editar Perfil
                        </li>
                    </ol>
                </nav>

                <div className="mt-4">
                    <div className="row mt-2">
                        {/* Bloque de descripciones */}
                        <div className="col-md-6 ">
                            <div className="card p-4 w-100">
                                <div className="card-header">
                                    <h4 className="ms-2">
                                        Datos del Usuario
                                    </h4>
                                </div>
                                <div className="card-body d-flex justify-content-center">
                                    <CambiarUserForm />
                                </div>
                            </div>
                        </div>
                        {/* Bloque del gráfico */}
                        <div className="col-md-6 d-flex">
                            <div className="card p-4 w-100">
                                <div className="card-header">
                                    <h4 className="ms-2">
                                        Cambiar Contraseña
                                    </h4>
                                </div>
                                <div className="card-body d-flex justify-content-center">
                                    <CambiarContraForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}