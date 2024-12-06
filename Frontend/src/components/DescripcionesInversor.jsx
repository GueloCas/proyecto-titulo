import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";
import { getDescripcionesInversor } from "../api/descripciones.api";
import { set } from "react-hook-form";
import { determinarClaseCPEstacion, getClassAndContent, getClassAndContentTooltip } from "../utils/tablaHelpers";

export function DescripcionesInversor({ inversor, anio, mes }) {
    const [descripciones, setDescripciones] = useState(null);
    const [percepciones, setPercepciones] = useState(null);
    const [error, setError] = useState("");
    const tablaRef = useRef(null); // Usamos useRef para referenciar la tabla

    let chart;

    useEffect(() => {
        async function loadDescripciones() {
            if (inversor) {
                setDescripciones(null); // Resetear descripciones para mostrar el mensaje "Cargando..."
                setError(""); // Limpiar errores anteriores
                try {
                    const data = await getDescripcionesInversor(inversor, anio, mes);
                    setDescripciones(data);
                    setPercepciones(data.percepciones);

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
            colors: ["#F25961", "#ffc107", "#28a745"]
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
        <>
            <div className="mt-4">
                <div className="row mt-2">
                    {/* Bloque de descripciones */}
                    <div className="col-md-6 d-flex">
                        <div className="card p-4 w-100">
                            <div className="card-header">
                                <h4 className="ms-2">
                                    Resúmenes de <strong>{descripciones.inversor}</strong> en el mes <strong>{mes}-{anio}</strong>
                                </h4>
                            </div>
                            <div className="card-body d-flex flex-column justify-content-center">
                                <div className="card card-stats card-danger card-round">
                                    <div className="card-body p-4">
                                        <div className="row">
                                            <div className="col-12">
                                                <h5 className="mb-0">El <strong>{promedioBaja}%</strong> de las horas la cantidad de producción fue <strong>BAJA</strong></h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-stats card-warning card-round">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12">
                                                <h5 className="mb-0">El <strong>{promedioMedia}%</strong> de las horas la cantidad de producción fue <strong>MEDIA</strong></h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-stats card-success card-round">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12">
                                                <h5 className="mb-0">El <strong>{promedioAlta}%</strong> de las horas la cantidad de producción fue <strong>ALTA</strong></h5>
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
                        Tabla de percepciones 1° de <strong>{descripciones.inversor}</strong> en el mes <strong>{mes}-{anio}</strong>
                    </h4>
                </div>
                <div className="table-responsive" ref={tablaRef}>
                    <table className="table table-bordered mt-4">
                        <thead>
                            <tr>
                                <th>Día/Hora</th>
                                {descripciones.horas_unicas.map(hora => (
                                    <th key={hora}>
                                        {hora}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {descripciones.dias_unicos.map(dia => (
                                <tr key={dia}>
                                    <td>{dia}</td>
                                    {descripciones.horas_unicas.map(hora => {
                                        // Buscar la percepción para el día y la hora específica
                                        const percepcion = descripciones.percepciones[dia] && descripciones.percepciones[dia][hora];

                                        if (percepcion) {
                                            const { className, content } = getClassAndContent(percepcion);
                                            return (
                                                <td key={hora} className={className}>
                                                    {content}
                                                </td>
                                            );
                                        } else {
                                            return (
                                                <td key={hora}>
                                                    -
                                                </td>
                                            );
                                        }
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
