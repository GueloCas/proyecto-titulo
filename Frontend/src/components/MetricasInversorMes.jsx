import { useEffect, useState } from "react";
import { getMetricasInversorMes } from "../api/estadisticas.api";

export function MetricasInversorMes({ inversorId, anio, mes }) {
    const [metricas, setMetricas] = useState([]);
    const [inversor, setEstacion] = useState(null);
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        if (inversorId && anio && mes) {
            async function loadMetricas() {
                setMetricas(null);
                try {
                    const data = await getMetricasInversorMes(inversorId);
                    setMetricas(data.estadisticas);
                } catch (error) {
                    setMensajeError("Hubo un error al cargar las métricas.");
                }
            }
            loadMetricas();
        }
    }, [inversorId, anio, mes]);

    if (!metricas) {
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
        <div>
            {/* Mostrar mensaje de error */}
            {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

            {/* Tabla de inversores */}
            {metricas.length > 0 && (
                <div className="mt-3">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Hora</th>
                                <th>Cantidad Promedio</th>
                                <th>Cantidad Máxima</th>
                                <th>Cantidad Mínima</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metricas.map((metrica, index) => (
                                <tr key={index}>
                                    <td>H{metrica.hora_num}</td>
                                    <td>{metrica.cantidad_promedio.toFixed(5)}</td>
                                    <td>{metrica.cantidad_maxima.toFixed(2)}</td>
                                    <td>{metrica.cantidad_minima.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
