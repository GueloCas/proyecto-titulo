import { Link, useParams } from "react-router-dom";
import { ProduccionGrados } from "../components/ProduccionGrados";


export function ProduccionGradosPage() {
    const { id } = useParams();
    const queryParams = new URLSearchParams(location.search);
    const nombreInversor = queryParams.get('inversor');

    return (
        <div className="container px-4 pt-2">
            <div className="mt-1 d-flex justify-content-between align-items-center">
                <h1>Grados de Pertenencia de inversor: {nombreInversor}</h1>
                <div className="d-flex justify-content-right align-items-center">
                    <Link to={`/ProduccionInversor/${id}`} className="text-decoration-none">
                        <button
                            className="btn btn-outline-secondary ms-4"
                            style={{ height: "38px" }}
                        >
                            Ver Tabla Producción
                        </button>
                    </Link>
                    <Link to={`/ProduccionInversor/Estadisticas/${id}?inversor=${nombreInversor}`} className="text-decoration-none">
                        <button
                            className="btn btn-outline-secondary ms-4"
                            style={{ height: "38px" }}
                        >
                            Ver Tabla Estadistica
                        </button>
                    </Link>
                </div>
            </div>

            <ProduccionGrados id={id}/>
        </div>
    );
}