import { useEffect, useState } from "react";
import { getProduccionPorInversor } from "../api/inversores.api";
import { Link } from "react-router-dom";
import ApexCharts from "apexcharts"; // Asegúrate de que está correctamente importado

export function ProduccionGrafico(req) {
    const [produccion, setProduccion] = useState([]);
    const [nombreInversor, setNombreInversor] = useState("");
    const queryParams = new URLSearchParams(location.search);
    const hora = queryParams.get('hora');
    let chart; // Variable para la instancia del gráfico

    useEffect(() => {
        async function loadProduccion() {
            const data = await getProduccionPorInversor(req.id, hora);
            setNombreInversor(data.nombre_inversor);
            setProduccion(data.producciones);
        }
        loadProduccion();
    }, [req.id]);

    useEffect(() => {
        if (produccion.length > 0) {
            renderChart(produccion);
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
            prices: producciones.map(p => parseFloat(p.cantidad) || 0), // Asegúrate de que sea un número
            dates: producciones.map(p => new Date(p.Dia).getTime()), // Convierte a milisegundos
        };

        console.log(seriesData);

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
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: 'Producción del Inversor', // Muestra la fecha del primer dato
                align: 'left'
            },
            subtitle: {
                text: 'Inversor: ' + nombreInversor + ', Hora: ' + hora, // Muestra la fecha del primer dato
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
        </div>
    );
}
