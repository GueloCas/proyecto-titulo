import { Link } from "react-router-dom";

export function PercepcionesComputacionalesPage() {
    return (
        <div className="container px-4 pt-2">
            <h1 className="my-2">Percepciones Computacionales</h1>
            <div className="d-flex justify-content-right align-items-center pt-2">
                <Link to={`/PercepcionesComputacionalesDiaHora`} className="text-decoration-none">
                    <button
                        className="btn btn-outline-secondary"
                        style={{ height: "38px" }}
                    >
                        Ver por Día y Hora
                    </button>
                </Link>
                <Link to={`/PercepcionesComputacionalesDia`} className="text-decoration-none">
                    <button
                        className="btn btn-outline-secondary ms-4"
                        style={{ height: "38px" }}
                    >
                        Ver por Dia
                    </button>
                </Link>
            </div>
        </div>
    );
}