import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { getDescripcionesEstacion } from "../api/descripciones.api";

export function DescripcionesEstacion({ estacion, anio, mes }) {
    const [descripciones, setDescripciones] = useState(null);
    const [error, setError] = useState("");
    let chart;

    useEffect(() => {
        async function loadDescripciones() {
            if (estacion) {
                setDescripciones(null); // Resetear descripciones para mostrar el mensaje "Cargando..."
                setError(""); // Limpiar errores anteriores
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

    useEffect(() => {
        if (descripciones) {
            renderChart(descripciones); // Renderizar el gráfico solo cuando las descripciones estén disponibles
        }
        // Limpiar el gráfico anterior si existe
        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, [descripciones]);

    const renderChart = (descripciones) => {
        const options = {
            chart: {
                type: "pie",
                height: 350,
            },
            labels: ["Baja", "Media", "Alta"],
            series: [
                (descripciones.suma_mala / descripciones.cantidad_r) * 100,
                (descripciones.suma_normal / descripciones.cantidad_r) * 100,
                (descripciones.suma_excelente / descripciones.cantidad_r) * 100,
            ],
            colors: ["#007bff", "#ffc107", "#28a745"],
            title: {
                text: "Distribución Lingüística",
                align: "center",
            },
        };

        const chartContainer = document.querySelector("#chart");
        if (chartContainer) {
            chart = new ApexCharts(chartContainer, options);
            chart.render();
        } else {
            console.error("El contenedor del gráfico no se encontró.");
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!descripciones) {
        return (
            <div className="text-center mt-4 d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span className="ms-2">Cargando...</span> {/* Agrega espacio entre el spinner y el texto */}
            </div>
        );
    }

    const promedioBaja = (descripciones.suma_mala * 100 / descripciones.cantidad_r).toFixed(2);
    const promedioMedia = (descripciones.suma_normal * 100 / descripciones.cantidad_r).toFixed(2);
    const promedioAlta = (descripciones.suma_excelente * 100 / descripciones.cantidad_r).toFixed(2);

    return (
        <div className="mt-4">
            <h4 className="ms-2">Detalles de la Estación</h4>
            <div className="row mt-2">
                <div className="col-md-6 d-flex">
                    <div className="card w-100 text-center">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Descripciones</h4>
                            <p className="fs-5 text-primary">
                                <strong>Mala:</strong> {descripciones.DL_mala}
                                <br />
                                <span className="fw-semibold">{promedioBaja} %</span>
                            </p>
                            <p className="fs-5 text-warning">
                                <strong>Normal:</strong> {descripciones.DL_normal}
                                <br />
                                <span className="fw-semibold">{promedioMedia} %</span>
                            </p>
                            <p className="fs-5 text-success">
                                <strong>Excelente:</strong> {descripciones.DL_excelente}
                                <br />
                                <span className="fw-semibold">{promedioAlta} %</span>
                            </p>
                        </div>
                    </div>
                </div>
                {/* Bloque del gráfico */}
                <div className="col-md-6 d-flex">
                    <div className="card w-100" id="chart"></div>
                </div>
            </div>

            {/* Información de los Inversores */}
            <h4 className="ms-2">Detalles de los Inversores</h4>
            <table className="table table-bordered mt-2">
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
                            <td>{inversor.DL_baja_inversor} ({(inversor.suma_baja_inversor * 100 / inversor.cantidad_r_inversor).toFixed(1)}%)</td>
                            <td>{inversor.DL_media_inversor} ({(inversor.suma_media_inversor * 100 / inversor.cantidad_r_inversor).toFixed(1)}%)</td>
                            <td>{inversor.DL_alta_inversor} ({(inversor.suma_alta_inversor * 100 / inversor.cantidad_r_inversor).toFixed(1)}%)</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
