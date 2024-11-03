import { useEffect, useState } from "react";
import { getPercepcionesComputacionalesDia } from "../api/inversores.api";

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

    const getClassAndContent = (percepcion) => {
        const { pertenencia_baja, pertenencia_media, pertenencia_alta } = percepcion;
        
        if (pertenencia_baja >= pertenencia_media && pertenencia_baja >= pertenencia_alta) {
            return {
                className: "baja-mayor font-size-09",
                content: (
                    <div>
                        <strong>Baja: {pertenencia_baja.toFixed(2)}</strong><br />
                        Media: {pertenencia_media.toFixed(2)}<br />
                        Alta: {pertenencia_alta.toFixed(2)}
                    </div>
                ),
            };
        } else if (pertenencia_media >= pertenencia_baja && pertenencia_media >= pertenencia_alta) {
            return {
                className: "media-mayor font-size-09",
                content: (
                    <div>
                        Baja: {pertenencia_baja.toFixed(2)}<br />
                        <strong>Media: {pertenencia_media.toFixed(2)}</strong><br />
                        Alta: {pertenencia_alta.toFixed(2)}
                    </div>
                ),
            };
        } else {
            return {
                className: "alta-mayor font-size-09",
                content: (
                    <div>
                        Baja: {pertenencia_baja.toFixed(2)}<br />
                        Media: {pertenencia_media.toFixed(2)}<br />
                        <strong>Alta: {pertenencia_alta.toFixed(2)}</strong>
                    </div>
                ),
            };
        }
    };

    const determinarClaseCPEstacion = (percepcion) => {
        if (percepcion.pertenencia_regular === 1) {
            return "alta-mayor font-size-09";
        } else if (percepcion.pertenencia_mala >= percepcion.pertenencia_normal && percepcion.pertenencia_mala !== 0) {
            return "baja-mayor font-size-09";
        } else if (percepcion.pertenencia_normal >= percepcion.pertenencia_excelente) {
            return "media-mayor font-size-09";
        } else {
            return "alta-mayor font-size-09";
        }
    };

    return (
        <div>
            <style>
                {`
                .baja-mayor {
                    background-color: #fcc1b4 !important;
                }
                
                .media-mayor {
                    background-color: #fbe3a3 !important;
                }
                
                .alta-mayor {
                    background-color: #d3fcb4 !important;
                }

                .font-size-09 {
                    font-size: 0.7rem;
                }
                `}
            </style>
            <h2>Tabla de percepciones computacionales</h2>
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
                                    <td className="font-size-09">{`${dia}, H${horaData.hora}`}</td>
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
                                    <td className={determinarClaseCPEstacion(horaData.percepciones_segundo_grado.at(-1))}>
                                        <div>
                                            M: {horaData.percepciones_segundo_grado.at(-1)?.pertenencia_mala}<br />
                                            N: {horaData.percepciones_segundo_grado.at(-1)?.pertenencia_normal}<br />
                                            E: {horaData.percepciones_segundo_grado.at(-1)?.pertenencia_excelente}<br />
                                            R: {horaData.percepciones_segundo_grado.at(-1)?.pertenencia_regular}
                                        </div>
                                    </td>
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
