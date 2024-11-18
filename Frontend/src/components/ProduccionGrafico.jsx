import { useEffect, useState } from "react";
import { getProduccionPorInversorHora } from "../api/produccion.api";
import { Link, useNavigate } from "react-router-dom";
import ApexCharts from "apexcharts";

export function ProduccionGrafico(req) {
    const [produccion, setProduccion] = useState([]);
    const [nombreInversor, setNombreInversor] = useState("");
    const [produccionMinima, setProduccionMinima] = useState(0);
    const [produccionMaxima, setProduccionMaxima] = useState(0);
    const [produccionPromedio, setProduccionPromedio] = useState(0);
    const [horaSeleccionada, setHoraSeleccionada] = useState(null);

    const navigate = useNavigate(); // Hook para la redirección

    // Extraer el parámetro de la URL (hora)
    const queryParams = new URLSearchParams(location.search);
    const hora = queryParams.get('hora'); // Esto te dará la hora con la 'H' (ej. "H8")

    let chart; // Variable para la instancia del gráfico

    // Establecer la hora seleccionada al cargar el componente
    useEffect(() => {
        if (hora) {
            // Extraer solo el número de la hora (eliminando la "H")
            setHoraSeleccionada(parseInt(hora.replace('H', ''), 10));
        }
    }, [hora]);

    // Cargar los datos de producción cuando la hora seleccionada cambia
    useEffect(() => {
        async function loadProduccion() {
            if (horaSeleccionada != null) {
                const horaConH = `H${horaSeleccionada}`; // Aseguramos que la hora esté en el formato "H8", "H9", etc.
                const data = await getProduccionPorInversorHora(req.id, horaConH);
                setNombreInversor(data.nombre_inversor);
                setProduccion(data.producciones);
                setProduccionMinima(data.minimo);
                setProduccionMaxima(data.maximo);
                setProduccionPromedio(data.promedio);
            }
        }
        loadProduccion();
    }, [horaSeleccionada, req.id]);

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
                text: 'Inversor: ' + nombreInversor + ', Hora: ' + horaSeleccionada,
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

    const handleHoraChange = (event) => {
        const selectedHora = event.target.value;
        setHoraSeleccionada(selectedHora); // Actualizar el estado con la hora seleccionada

        // Redirigir a la ruta correspondiente con el parámetro hora
        const horaConH = `H${selectedHora}`; // Aseguramos que la hora esté en el formato "H8", "H9", etc.
        navigate(`/inversor/${req.id}/produccion/grafico?hora=${horaConH}`);
    };

    return (
        <div className="container card px-5 py-4">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Gráfico {nombreInversor} - H{horaSeleccionada}</h1>
                <Link to={`/inversor/${req.id}/produccion`} className=" text-decoration-none">
                    <button className="btn btn-success">Volver</button>
                </Link>
            </div>

            {/* Input select para la hora */}
            <div className="mb-3 d-flex align-items-center">
                <label htmlFor="hora" className="form-label mb-0 me-2">Seleccione una hora:</label>
                <select
                    className="form-select w-auto"
                    value={horaSeleccionada || ''}
                    onChange={handleHoraChange}
                >
                    {Array.from({ length: 15 }, (_, index) => index + 8).map(hora => (
                        <option key={hora} value={hora}>
                            {hora}:00
                        </option>
                    ))}
                </select>
            </div>


            <div className="mt-2 border border-black p-4 rounded-4 w-100" style={{ marginTop: '150px' }}>
                <div id="chart"></div> {/* Contenedor para el gráfico */}
            </div>
            <div className="mt-3">
                <span className="fs-3">Producción mínima del Inversor: <span className="fw-bold">{produccionMinima}</span></span>
                <br />
                <span className="fs-3">Producción máxima del Inversor: <span className="fw-bold">{produccionMaxima}</span></span>
                <br />
                <span className="fs-3">Producción promedio del Inversor: <span className="fw-bold">{produccionPromedio}</span></span>
            </div>
        </div>
    );
}
