import { useEffect, useState } from "react";
import { getPercepcionesSegundoGradoDiaHora } from "../api/percepciones.api";

export function PCTablaDiaHora({ estacionId, anio, mes, dia, hora }) {
    const [percepciones, setPercepciones] = useState(null); // Estado para almacenar los datos
    const [estacion, setEstacion] = useState(null);
    const [error, setError] = useState(null); // Estado para almacenar errores

    useEffect(() => {
        async function obtenerPC() {
            setPercepciones(null);
            try {
                setError(null); // Resetea el error
                const data = await getPercepcionesSegundoGradoDiaHora(estacionId, anio, mes, dia, hora);
                setEstacion(data.estacion); // Almacena la estación en el estado
                setPercepciones(data.percepciones); // Almacena los datos en el estado
            } catch (err) {
                setError(err.response.data.error); // Manejo de errores
                console.error(err.response.data.error);
            }
        }
        obtenerPC();
    }, [estacionId, anio, mes, dia, hora]);

    if (!percepciones) {
        return (
            <div className="text-center mt-4 d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span className="ms-2">Cargando...</span>
            </div>
        );
    }

    return (
        <>
            {error && <div className="alert alert-danger">{error}</div>}
            {percepciones && !error ? (
                <>
                    <div className="card mt-4 p-4">
                        <div className="card-header">
                            <h4 className="ms-2">
                                Percepciones de 2° de <strong>{estacion}</strong> el día <strong>{dia}-{mes}-{anio}</strong> a la hora <strong>{hora}:00</strong>
                            </h4>
                        </div>
                        <div className='row mt-4'>
                            <div className="col-sm-6 col-md-3">
                                <div className="card card-stats card-danger card-round">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-5">
                                                <div className="icon-big text-center">
                                                    <p className="mb-0">Mala:</p>
                                                </div>
                                            </div>
                                            <div className="col-7 col-stats">
                                                <div className="numbers">
                                                    <h2>{percepciones[percepciones.length - 1]?.pertenencia_mala !== undefined
                                                        ? percepciones[percepciones.length - 1].pertenencia_mala.toFixed(4)
                                                        : "N/A"}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 col-md-3">
                                <div className="card card-stats card-warning card-round">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-5">
                                                <div className="icon-big text-center">
                                                    <p className="mb-0">Normal:</p>
                                                </div>
                                            </div>
                                            <div className="col-7 col-stats">
                                                <div className="numbers">
                                                    <h2>{percepciones[percepciones.length - 1]?.pertenencia_normal !== undefined
                                                        ? percepciones[percepciones.length - 1].pertenencia_normal.toFixed(4)
                                                        : "N/A"}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 col-md-3">
                                <div className="card card-stats card-success card-round">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-5">
                                                <div className="icon-big text-center">
                                                    <p className="mb-0">Excelente:</p>
                                                </div>
                                            </div>
                                            <div className="col-7 col-stats">
                                                <div className="numbers">
                                                    <h2>{percepciones[percepciones.length - 1]?.pertenencia_excelente !== undefined
                                                        ? percepciones[percepciones.length - 1].pertenencia_excelente.toFixed(4)
                                                        : "N/A"}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 col-md-3">
                                <div className="card card-stats card-primary card-round">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-5">
                                                <div className="icon-big text-center">
                                                    <p className="mb-0">Regular:</p>
                                                </div>
                                            </div>
                                            <div className="col-7 col-stats">
                                                <div className="numbers">
                                                    <h2>{percepciones[percepciones.length - 1]?.pertenencia_regular !== undefined
                                                        ? percepciones[percepciones.length - 1].pertenencia_regular.toFixed(4)
                                                        : "N/A"}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-4 p-4">
                        <div className="card-header">
                            <h4 className="ms-2">
                                Percepciones de 1° por inversor de <strong>{estacion}</strong> el día <strong>{dia}-{mes}-{anio}</strong> a la hora <strong>{hora}:00</strong>
                            </h4>
                        </div>
                        <div className="table-responsive mt-4">
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Inversor</th>
                                        <th>P1° Baja</th>
                                        <th>P1° Media</th>
                                        <th>P1° Alta</th>
                                        <th>Promedio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Excluye el último índice que contiene estadísticas */}
                                    {percepciones.slice(0, -1).map((item, index) => {
                                        // Determinar clase CSS según las condiciones
                                        let rowClass = "";
                                        if (item.pertenencia_baja >= item.pertenencia_media && item.pertenencia_baja !== 0) {
                                            rowClass = "baja-mayor";
                                        } else if (item.pertenencia_media >= item.pertenencia_alta) {
                                            rowClass = "media-mayor";
                                        } else {
                                            rowClass = "alta-mayor";
                                        }

                                        return (
                                            <tr key={index} className={rowClass}>
                                                <td>{item.inversor}</td>
                                                <td>{item.pertenencia_baja}</td>
                                                <td>{item.pertenencia_media}</td>
                                                <td>{item.pertenencia_alta}</td>
                                                <td>{item.average}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                !error && <p>Cargando datos...</p>
            )}
        </>
    );

}
