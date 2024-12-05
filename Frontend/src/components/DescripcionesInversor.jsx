import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { getDescripcionesInversor } from "../api/descripciones.api";

export function DescripcionesInversor({ inversor, anio, mes }) {
    const [descripciones, setDescripciones] = useState(null);
    const [error, setError] = useState("");
    let chart;

    useEffect(() => {
        async function loadDescripciones() {
            if (inversor) {
                setDescripciones(null); // Resetear descripciones para mostrar el mensaje "Cargando..."
                setError(""); // Limpiar errores anteriores
                try {
                    const data = await getDescripcionesInversor(inversor, anio, mes);
                    setDescripciones(data);
                } catch (error) {
                    setError("Hubo un error al cargar las descripciones.");
                }
            }
        }
        loadDescripciones();
    }, [inversor, anio, mes]); // Actualizar al cambiar cualquiera de los parámetros

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
                (descripciones.suma_baja / descripciones.cantidad_r) * 100,
                (descripciones.suma_media / descripciones.cantidad_r) * 100,
                (descripciones.suma_alta / descripciones.cantidad_r) * 100,
            ],
            colors: ["#F25961", "#ffc107", "#28a745"],
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
                <span className="ms-2">Cargando...</span>
            </div>
        );
    }

    const promedioBaja = ((descripciones.suma_baja / descripciones.cantidad_r) * 100).toFixed(2);
    const promedioMedia = ((descripciones.suma_media / descripciones.cantidad_r) * 100).toFixed(2);
    const promedioAlta = ((descripciones.suma_alta / descripciones.cantidad_r) * 100).toFixed(2);

    return (
        <div className="mt-4">
            <h4 className="ms-2">Detalles del Inversor</h4>
            <div className="row mt-2">
                {/* Bloque de descripciones */}
                <div className="col-md-6 d-flex">
                    <div className="card w-100 text-center">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Descripciones</h4>
                            <p className="fs-5 text-danger">
                                <strong>Baja:</strong> {descripciones.DL_baja}
                                <br />
                                <span className="fw-semibold">{promedioBaja} %</span>
                            </p>
                            <p className="fs-5 text-warning">
                                <strong>Media:</strong> {descripciones.DL_media}
                                <br />
                                <span className="fw-semibold">{promedioMedia} %</span>
                            </p>
                            <p className="fs-5 text-success">
                                <strong>Alta:</strong> {descripciones.DL_alta}
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
        </div>
    );
}
