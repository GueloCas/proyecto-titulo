import React, { useEffect, useState } from "react";
import { getDescripcionesInversor } from "../api/descripciones.api";

export function DescripcionesInversor({ inversor, anio, mes }) {
    const [descripciones, setDescripciones] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDescripciones() {
            if (inversor) {
                try {
                    const data = await getDescripcionesInversor(inversor);
                    setDescripciones(data);
                } catch (error) {
                    setError("Hubo un error al cargar las descripciones.");
                }
            }
        }
        loadDescripciones();
    }, [inversor, anio, mes]);

    if (!inversor) {
        return <div className="alert alert-info">Por favor, selecciona un inversor.</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!descripciones) {
        return <div className="text-center">Cargando descripciones...</div>;
    }

    // Calcular promedios (suma / cantidad total)
    const promedioBaja = (descripciones.suma_baja / descripciones.cantidad_r).toFixed(2);
    const promedioMedia = (descripciones.suma_media / descripciones.cantidad_r).toFixed(2);
    const promedioAlta = (descripciones.suma_alta / descripciones.cantidad_r).toFixed(2);

    return (
        <div className="mt-4">
            <h3>Descripciones Lingüísticas</h3>
            <div className="row">
                {/* Tarjeta Baja */}
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h4 className="card-title text-primary">Baja</h4>
                            <p className="fs-5 fw-bold">{descripciones.DL_baja}</p>
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
                            <h4 className="card-title text-warning">Media</h4>
                            <p className="fs-5 fw-bold">{descripciones.DL_media}</p>
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
                            <h4 className="card-title text-success">Alta</h4>
                            <p className="fs-5 fw-bold">{descripciones.DL_alta}</p>
                            <p className="text-muted">
                                Promedio: <span className="fw-semibold">{promedioAlta}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
