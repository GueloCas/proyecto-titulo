import { useEffect, useState } from "react";
import { getPercepcionesSegundoGradoDia } from "../api/percepciones.api";
import { getClassAndContent, determinarClaseCPEstacion } from "../utils/tablaHelpers";

export function PCTablaDia({ estacionId, anio, mes, dia }) {
    const [percepciones, setPercepciones] = useState(null);
    const [estacion, setEstacion] = useState(null);
    const [error, setError] = useState(null);
    const [inversoresUnicos, setInversoresUnicos] = useState([]);

    useEffect(() => {
        async function obtenerPC(dia) {
            setPercepciones(null);
            try {
                setError(null);
                const data = await getPercepcionesSegundoGradoDia(estacionId, dia);
                setEstacion(data.estacion);
                setPercepciones(data.percepciones);

                // Extraer los nombres únicos de inversores
                const nombresInversores = new Set();
                data.percepciones.forEach(horaData => {
                    horaData.percepciones_segundo_grado.forEach(percepcion => {
                        if (percepcion.inversor) {
                            nombresInversores.add(percepcion.inversor);
                        }
                    });
                });
                setInversoresUnicos(Array.from(nombresInversores));
            } catch (err) {
                setError(err.response?.data?.error || "Error al obtener los datos");
                console.error(err.response?.data?.error || err.message);
            }
        }

        if (dia) {
            obtenerPC(dia);
        }
    }, [dia]);

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
                                Percepciones de 2° de <strong>{estacion}</strong> el día <strong>{dia}-{mes}-{anio}</strong>
                            </h4>
                        </div>
                        <div className="table-responsive mt-4">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        {percepciones.map((horaData, idx) => (
                                            <th key={idx}>{`H${horaData.hora}`}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {percepciones.map((horaData, idx) => {
                                            const { className, content } = determinarClaseCPEstacion(horaData.percepciones_segundo_grado.at(-1));
                                            return (
                                                <td key={idx} className={className}>
                                                    {content}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>

                            </table>
                        </div>
                    </div>
                    <div className="card mt-4 p-4">
                        <div className="card-header">
                            <h4 className="ms-2">
                                Percepciones de 1° por inversor de <strong>{estacion}</strong> el día <strong>{dia}-{mes}-{anio}</strong>
                            </h4>
                        </div>
                        <div className="table-responsive mt-4">
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Hora</th>
                                        {inversoresUnicos.map((inversor, idx) => (
                                            <th key={idx}>{inversor}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {percepciones.map((horaData, idx) => (
                                        <tr key={idx}>
                                            <td className="fs-07">{`H${horaData.hora}`}</td>
                                            {inversoresUnicos.map((inversor) => {
                                                const percepcion = horaData.percepciones_segundo_grado.find(
                                                    (p) => p.inversor === inversor
                                                );
                                                if (percepcion) {
                                                    const { className, content } = getClassAndContent(percepcion);
                                                    return <td key={inversor} className={className}>{content}</td>;
                                                } else {
                                                    return <td key={inversor}>-</td>;
                                                }
                                            })}
                                        </tr>
                                    ))}
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
