import { useEffect, useState } from "react";
import { getProduccionPorInversorHora } from "../api/produccion.api";
import { Link } from "react-router-dom";
import ApexCharts from "apexcharts"; 

export function ProduccionGrafico(req) {
    const [produccion, setProduccion] = useState([]);
    const [nombreInversor, setNombreInversor] = useState("");
    const [produccionMinima, setProduccionMinima] = useState(0);
    const [produccionMaxima, setProduccionMaxima] = useState(0);
    const [produccionPromedio, setProduccionPromedio] = useState(0);

    // Extraer el parámetro de la URL
    const queryParams = new URLSearchParams(location.search);
    const hora = queryParams.get('hora');

    let chart; // Variable para la instancia del gráfico

    useEffect(() => {
        async function loadProduccion() {
            const data = await getProduccionPorInversorHora(req.id, hora);
            setNombreInversor(data.nombre_inversor);
            setProduccion(data.producciones);
            setProduccionMinima(data.minimo);
            setProduccionMaxima(data.maximo);
            setProduccionPromedio(data.promedio);
        }
        loadProduccion();
    }, [req.id]);

    useEffect(() => {
        if (produccion.length > 0) { 
            renderChart(produccion); // Renderizar el gráfico
        }
        // Limpiar el gráfico anterior si existe
        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, [produccion]); // Ejecutar cuando 'produccion' cambie

    const renderChart = (producciones) => {
        const seriesData = {
            prices: producciones.map(p => parseFloat(p.cantidad) || 0), // Extrae las cantidades
            dates: producciones.map(p => new Date(p.Dia).getTime()), // Convierte a milisegundos
        };

        var options = {
            series: [{
                name: "Producción",
                data: seriesData.prices
            }],
            chart: {
                type: 'area',
                height: 350,
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false  
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: 'Producción del Inversor', 
                align: 'left'
            },
            subtitle: {
                text: 'Inversor: ' + nombreInversor + ', Hora: ' + hora, 
                align: 'left'
            },
            xaxis: {
                type: 'datetime',
                categories: seriesData.dates // Usa las fechas como categorías
            },
            yaxis: {
                opposite: true,
                min: 0,
                max: Math.max(...seriesData.prices) + 1 // Ajusta el máximo
            },
            legend: {
                horizontalAlign: 'left'
            }
        };

        const chartContainer = document.querySelector("#chart");
        if (chartContainer) {
            chart = new ApexCharts(chartContainer, options);
            chart.render();
        } else {
            console.error("El contenedor del gráfico no se encontró.");
        }
    };

    return (
        <div className="container">
            <div className="mt-3 d-flex justify-content-between align-items-center">
                <h1>Gráfico {nombreInversor} - {hora}</h1>
                <Link to={`/ProduccionInversor/${req.id}`} className=" text-decoration-none">
                    <button className="btn btn-success">Volver</button>
                </Link>
            </div>
            <div className="mt-2 border border-black p-4 rounded-4 w-100">
                <div id="chart"></div> {/* Contenedor para el gráfico */}
            </div>
            <div className="mt-3">
                <span className="fs-3">Producción mínima del Inversor: <span className="fw-bold">{produccionMinima}</span></span>
                <br/>
                <span className="fs-3">Producción máxima del Inversor: <span className="fw-bold">{produccionMaxima}</span></span>
                <br/>
                <span className="fs-3">Producción promedio del Inversor: <span className="fw-bold">{produccionPromedio}</span></span>
            </div>
        </div>
    );
}
