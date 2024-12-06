import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { getDescripcionesEstacion } from "../api/descripciones.api";

export function DescripcionesEstacion({ estacion, anio, mes }) {
    const [descripciones, setDescripciones] = useState(null);
    const [percepciones, setPercepciones] = useState(null);
    const [error, setError] = useState("");
    let chart;

    useEffect(() => {
        async function loadDescripciones() {
            if (estacion) {
                setDescripciones(null); // Resetear descripciones para mostrar el mensaje "Cargando..."
                setError(""); // Limpiar errores anteriores
                try {
                    const data = await getDescripcionesEstacion(estacion, anio, mes);
                    console.log(data);
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
            colors: ["#F25961", "#ffc107", "#28a745"],
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
        <>
            <div className="mt-4">
                <div className="row">
                    {/* Bloque de descripciones */}
                    <div className="col-md-6 d-flex">
                        <div className="card p-4 w-100">
                            <div className="card-header">
                                <h4 className="ms-2">
                                    Resúmenes de <strong>{descripciones.estacion}</strong> en el mes <strong>{mes}-{anio}</strong>
                                </h4>
                            </div>
                            <div className="card-body d-flex flex-column justify-content-center">
                                <div className="card card-stats card-danger card-round">
                                    <div className="card-body p-4">
                                        <div className="row">
                                            <div className="col-12">
                                                <h5 className="mb-0">El <strong>{promedioBaja}%</strong> de las horas la cantidad de producción fue <strong>MALA</strong></h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-stats card-warning card-round">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12">
                                                <h5 className="mb-0">El <strong>{promedioMedia}%</strong> de las horas la cantidad de producción fue <strong>NORMAL</strong></h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-stats card-success card-round">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12">
                                                <h5 className="mb-0">El <strong>{promedioAlta}%</strong> de las horas la cantidad de producción fue <strong>EXCELENTE</strong></h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* Bloque del gráfico */}
                    <div className="col-md-6 d-flex">
                        <div className="card p-4 w-100">
                            <div className="card-header">
                                <h4 className="ms-2">
                                    Gráfico de <strong>{descripciones.inversor}</strong> en el mes <strong>{mes}-{anio}</strong>
                                </h4>
                            </div>
                            <div className="card-body">
                                <div id="chart"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card p-4">
                <div className="card-header">
                    <h4 className="ms-2">
                        Tabla porcentajes por inversor de <strong>{descripciones.estacion}</strong> en el mes <strong>{mes}-{anio}</strong>
                    </h4>
                </div>
                <table className="table table-bordered mt-4">
                    <thead>
                        <tr className="text-center">
                            <th>Inversor</th>
                            <th>Descripción Baja</th>
                            <th>Descripción Media</th>
                            <th>Descripción Alta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {descripciones.inversores_info.map((inversor) => (
                            <tr className="text-center" key={inversor.inversor_id}>
                                <td >{inversor.inversor_nombre}</td>
                                <td>{(inversor.suma_baja_inversor * 100 / inversor.cantidad_r_inversor).toFixed(1)}%</td>
                                <td>{(inversor.suma_media_inversor * 100 / inversor.cantidad_r_inversor).toFixed(1)}%</td>
                                <td>{(inversor.suma_alta_inversor * 100 / inversor.cantidad_r_inversor).toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
