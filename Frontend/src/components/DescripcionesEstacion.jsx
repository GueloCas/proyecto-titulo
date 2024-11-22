import React, { useEffect, useState } from "react";
import { getDescripcionesEstacion } from "../api/descripciones.api";

export function DescripcionesEstacion({ estacion, anio, mes }) {
    const [descripciones, setDescripciones] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDescripciones() {
            if (estacion) {
                try {
                    const data = await getDescripcionesEstacion(estacion);
                    setDescripciones(data);
                } catch (error) {
                    setError("Hubo un error al cargar las descripciones.");
                }
            }
        }
        loadDescripciones();
    }, [estacion, anio, mes]);

    if (!estacion) {
        return <div className="alert alert-info">Por favor, selecciona un estación.</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!descripciones) {
        return <div className="text-center">Cargando descripciones...</div>;
    }

    const promedioBaja = (descripciones.suma_mala / descripciones.cantidad_r).toFixed(2);
    const promedioMedia = (descripciones.suma_normal / descripciones.cantidad_r).toFixed(2);
    const promedioAlta = (descripciones.suma_excelente / descripciones.cantidad_r).toFixed(2);

    return (
        <div className="mt-4">
            <h3>Descripciones Lingüísticas de la Estación</h3>
            <div className="row">
                {/* Tarjeta Baja */}
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h4 className="card-title text-primary">Mala</h4>
                            <p className="fs-5 fw-bold">{descripciones.DL_mala}</p>
                            <p className="text-muted">
                                Promedio: <span className="fw-semibold">{promedioBaja}</span>
                            </p>
                        </div>
                    </div>
                </div>
                {/* Tarjeta Media */}
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h4 className="card-title text-warning">Normal</h4>
                            <p className="fs-5 fw-bold">{descripciones.DL_normal}</p>
                            <p className="text-muted">
                                Promedio: <span className="fw-semibold">{promedioMedia}</span>
                            </p>
                        </div>
                    </div>
                </div>
                {/* Tarjeta Alta */}
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h4 className="card-title text-success">Excelente</h4>
                            <p className="fs-5 fw-bold">{descripciones.DL_excelente}</p>
                            <p className="text-muted">
                                Promedio: <span className="fw-semibold">{promedioAlta}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de los Inversores */}
            <h4 className="mt-4">Descripciones de los Inversores</h4>
            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Inversor</th>
                        <th>Descripción Baja</th>
                        <th>Descripción Media</th>
                        <th>Descripción Alta</th>
                    </tr>
                </thead>
                <tbody>
                    {descripciones.inversores_info.map((inversor) => (
                        <tr key={inversor.inversor_id}>
                            <td>{inversor.inversor_nombre}</td>
                            <td>{inversor.DL_baja_inversor}</td>
                            <td>{inversor.DL_media_inversor}</td>
                            <td>{inversor.DL_alta_inversor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
