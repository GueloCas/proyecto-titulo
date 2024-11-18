import { Link, useParams } from "react-router-dom";
import { ProduccionEstadisticas } from "../components/ProduccionEstadisticas";

export function ProduccionEstadisticasPage() {
    const { id } = useParams();
    const queryParams = new URLSearchParams(location.search);
    const nombreInversor = queryParams.get('inversor');

    return (
        <div className="container">
            <div className="page-inner">
            <div className="mt-1 d-flex justify-content-between align-items-center">
                <h1 className="mb-3 fw-bold">Estadisticas de inversor: {nombreInversor}</h1>
                <div className="d-flex justify-content-right align-items-center">
                    <Link to={`/inversor/${id}/produccion`} className="text-decoration-none">
                        <button
                            className="btn btn-outline-secondary ms-4"
                            style={{ height: "38px" }}
                        >
                            Ver Tabla Producción
                        </button>
                    </Link>
                    <Link to={`/ProduccionInversor/Grados/${id}?inversor=${nombreInversor}`} className="text-decoration-none">
                        <button
                            className="btn btn-outline-secondary ms-4"
                            style={{ height: "38px" }}
                        >
                            Ver Tabla Grados
                        </button>
                    </Link>
                </div>
            </div>

            <ProduccionEstadisticas id={id}/>
            </div>
        </div>
    );
}