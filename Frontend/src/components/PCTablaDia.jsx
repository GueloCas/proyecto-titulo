import { useEffect, useState } from "react";
import { getPercepcionesComputacionalesDia } from "../api/percepciones.api";
import { getClassAndContent, determinarClaseCPEstacion } from "../utils/tablaHelpers";

export function PCTablaDia({ dia }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [inversoresUnicos, setInversoresUnicos] = useState([]);

    useEffect(() => {
        async function obtenerPC(dia) {
            try {
                setError(null);
                const responseData = await getPercepcionesComputacionalesDia(dia);
                setData(responseData);

                // Extraer los nombres únicos de inversores
                const nombresInversores = new Set();
                responseData.forEach(horaData => {
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

    return (
        <div>
            <h2>Tabla de percepciones computacionales 2° Grado</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {data && !error ? (
                <div>
                    <table className="mt-1 mb-3 table table-bordered table-hover border-dark">
                        <thead>
                            <tr>
                                <th>Día y Hora</th>
                                {inversoresUnicos.map((inversor, idx) => (
                                    <th key={idx}>{inversor}</th>
                                ))}
                                <th>CP Estación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((horaData, idx) => (
                                <tr key={idx}>
                                    <td className="fs-07">{`${dia}, H${horaData.hora}`}</td>
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
                                    {(() => {
                                        const { className, content } = determinarClaseCPEstacion(horaData.percepciones_segundo_grado.at(-1));
                                        return <td className={className}>{content}</td>;
                                    })()}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !error && <p>Cargando datos...</p>
            )}
        </div>
    );
}
