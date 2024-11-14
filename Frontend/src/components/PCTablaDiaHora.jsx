import { useEffect, useState } from "react";
import { getPercepcionesComputacionales } from "../api/percepciones.api";

export function PCTablaDiaHora({ dia, hora }) {
    const [data, setData] = useState(null); // Estado para almacenar los datos
    const [error, setError] = useState(null); // Estado para almacenar errores

    useEffect(() => {
        async function obtenerPC(dia, hora) {
            try {
                setError(null); // Resetea el error
                const responseData = await getPercepcionesComputacionales(dia, hora);
                setData(responseData.percepciones_segundo_grado); // Almacena los datos en el estado
                console.log(responseData.percepciones_segundo_grado);
            } catch (err) {
                setError(err.response.data.error); // Manejo de errores
                console.error(err.response.data.error);
            }
        }

        if (dia && hora) { // Verifica que dia y hora no sean vacíos
            obtenerPC(dia, hora);
        }
    }, [dia, hora]);

    return (
        <div>
            <h2>Tabla de percepciones computacionales</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {data && !error ? (
                <div>
                    <table className="mt-1 mb-0 table table-bordered table-hover border-dark">
                        <thead>
                            <tr>
                                <th>Inversor</th>
                                <th>TL Baja</th>
                                <th>TL Media</th>
                                <th>TL Alta</th>
                                <th>Promedio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Excluye el último índice que contiene estadísticas */}
                            {data.slice(0, -1).map((item, index) => {
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

                    <div className="mt-3 d-flex gap-3">
                        <div className='card w-50 p-4 border-0 rounded-3'>{/* Muestra las estadísticas usando el último elemento de data */}
                            <h3>Estadísticas</h3>
                            <span>Media: {data[data.length - 1]?.value_mean}</span><br />
                            <span>Varianza: {data[data.length - 1]?.variance}</span><br />
                            <span>Desviación Estándar: {data[data.length - 1]?.standard_deviation}</span>
                        </div>
                        <div className='card w-50 p-4  border-0 rounded-3'>{/* Muestra las estadísticas usando el último elemento de data */}
                            <h3>CP Estación</h3>
                            <span>Mala: {data[data.length - 1]?.pertenencia_mala}</span><br />
                            <span>Normal: {data[data.length - 1]?.pertenencia_normal}</span><br />
                            <span>Excelente: {data[data.length - 1]?.pertenencia_excelente}</span><br />
                            <span>Regular: {data[data.length - 1]?.pertenencia_regular}</span>
                        </div>
                    </div>

                </div>
            ) : (
                !error && <p>Cargando datos...</p>
            )}
        </div>
    );

}
