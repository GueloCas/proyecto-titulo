import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import { getProduccionPorInversorHora, getProduccionVLinguisticas } from '../api/inversores.api';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const LogicaDifusaChart = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dataVL, setDataVL] = useState(null);
    const queryParams = new URLSearchParams(location.search);
    const hora = queryParams.get('hora');
    const [min, setMin] = useState(parseFloat(queryParams.get('min')));
    const [max, setMax] = useState(parseFloat(queryParams.get('max')));
    const [cantidad, setCantidad] = useState(parseFloat(queryParams.get('cantidad')) !== undefined ? parseFloat(queryParams.get('cantidad')) : null);
    const dia = queryParams.get('dia');
    const id = queryParams.get('inversor');
    const [dataLabel, setDataLabel] = useState(cantidad);
    const [inputValue, setInputValue] = useState(cantidad);

   console.log('Hora:', min);

    async function fetchMinMaxAndData() {
        try {
            if (!min || !max) {
                const dataMinMax = await getProduccionPorInversorHora(id, hora);
                setMin(dataMinMax.minimo);
                setMax(dataMinMax.maximo);
            }
        } catch (error) {
            console.error('Error al cargar min/max:', error);
        }
    }

    async function loadLogicaDifusa(minValue, maxValue) {
        try {
            const data = await getProduccionVLinguisticas(cantidad, minValue, maxValue);
            console.log('Datos de lógica difusa recibidos:', data); // Verifica que los datos sean correctos
            setDataVL(data);
        } catch (error) {
            console.error('Error al cargar datos de lógica difusa:', error);
        }
    }

    useEffect(() => {
        fetchMinMaxAndData();
    }, [hora]);

    useEffect(() => {
        if (min !== undefined && max !== undefined) {
            loadLogicaDifusa(min, max);
        }
    }, [min, max, cantidad]);

    useEffect(() => {
        if (!dataVL) return;

        const bajo = [
            [dataVL.TLbaja[0], 1],
            [dataVL.TLbaja[1], 1],
            [dataVL.TLbaja[2], 1],
            [dataVL.TLbaja[3], 0],
        ];

        const medio = [
            [dataVL.TLmedia[0], 0],
            [dataVL.TLmedia[1], 1],
            [dataVL.TLmedia[2], 1],
            [dataVL.TLmedia[3], 0],
        ];

        const alto = [
            [dataVL.TLalta[0], 0],
            [dataVL.TLalta[1], 1],
            [dataVL.TLalta[2], 1],
            [dataVL.TLalta[3], 1],
        ];

        let gradoSeleccionado = { baja: 0, media: 0, alta: 0 };

        if (dataLabel !== null) {
            gradoSeleccionado = dataVL.pertenencia;
        }

        const valorSeleccionado = dataLabel !== null ? [
            [dataLabel, 0],
            [dataLabel, gradoSeleccionado.baja > 0 ? gradoSeleccionado.baja : 0],
            [dataLabel, gradoSeleccionado.media > 0 ? gradoSeleccionado.media : 0],
            [dataLabel, gradoSeleccionado.alta > 0 ? gradoSeleccionado.alta : 0]
        ] : [];

        const options = {
            series: [
                { name: "Bajo", data: bajo },
                { name: "Medio", data: medio },
                { name: "Alto", data: alto },
                { name: "Valor Seleccionado", data: valorSeleccionado }
            ],
            chart: {
                height: 350,
                offsetX: 0,
                type: 'area',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            colors: ['#77B6EA', '#545454', '#FF4560', '#FFC107'],
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: 'Variables Lingüísticas (Lógica Difusa)',
                align: 'left'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            markers: {
                size: 1
            },
            xaxis: {
                type: 'numeric',
                min: min,
                max: max,
                tickAmount: 50,
                labels: {
                    show: true,
                    formatter: function (value) {
                        return value;
                    },
                    hideOverlappingLabels: false,
                },
            },
            yaxis: {
                min: 0,
                max: 1.2,
                title: {
                    text: 'Grado de Pertenencia'
                },
                labels: {
                    formatter: function (val) {
                        return val === 0 ? '0' : val === 1 ? '1' : '';
                    }
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
            annotations: {
                xaxis: [{
                    x: dataLabel,
                    borderColor: '#000',
                    label: {
                        show: true,
                        text: `Valor Seleccionado: ${dataLabel}`,
                        style: {
                            color: '#fff',
                            background: '#000'
                        }
                    }
                }]
            }
        };

        const chartContainer = document.querySelector("#logicaDifusaChart");
        const chart = new ApexCharts(chartContainer, options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }, [dataVL, dataLabel]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        if (inputValue) {
            setDataLabel(inputValue);
            console.log("Nuevo valor ingresado:", inputValue);
            navigate(`/ProduccionInversor/VLinguisticas?hora=${hora}&cantidad=${inputValue}&inversor=${id}&dia=${dia}&min=${min}&max=${max}`);
            window.location.reload();
        }
    };

    return (
        <div className='container'>
            <div className="mt-3 d-flex justify-content-between align-items-center">
                <h1 className='mt-3'>Producción en hora: {hora}, día: {dia}</h1>
                <Link to={`/ProduccionInversor/${id}`} className=" text-decoration-none">
                    <button className="btn btn-success">Volver</button>
                </Link>
            </div>
            <div id="logicaDifusaChart"></div>
            <div className="text-center">
                <span className="badge" style={{ backgroundColor: dataVL?.pertenencia.baja > 0 ? '#77B6EA' : '#ddd', margin: '0 5px', fontSize: '18px' }}>
                    Baja: {dataVL?.pertenencia.baja.toFixed(2)}
                </span>
                <span className="badge" style={{ backgroundColor: dataVL?.pertenencia.media > 0 ? '#545454' : '#ddd', margin: '0 5px', fontSize: '18px' }}>
                    Media: {dataVL?.pertenencia.media.toFixed(2)}
                </span>
                <span className="badge" style={{ backgroundColor: dataVL?.pertenencia.alta > 0 ? '#FF4560' : '#ddd', margin: '0 5px', fontSize: '18px' }}>
                    Alta: {dataVL?.pertenencia.alta.toFixed(2)}
                </span>
            </div>
            <div className="mt-3 d-flex align-items-center justify-content-center">
                <input
                    type="number"
                    className="form-control w-25 me-2"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Simular un valor"
                    min={min} // Establece el valor mínimo
                    max={max} // Establece el valor máximo
                    step={0.1} // Establece el incremento
                />
                <button className="btn btn-primary" onClick={handleSubmit}>Enviar</button>
            </div>

            <div className="mt-3 d-flex">
                <div className='w-50'>
                    <h3>Valores de las Variables Lingüísticas</h3>
                    <span>Min: {min}</span><br />
                    <span>Max: {max}</span>
                    {dataVL && (
                        <div>
                            <span>TLbaja: [{dataVL.TLbaja.join(', ')}]</span><br />
                            <span>TLmedia: [{dataVL.TLmedia.join(', ')}]</span><br />
                            <span>TLalta: [{dataVL.TLalta.join(', ')}]</span>
                        </div>
                    )}
                </div>
                <div className='w-50'>
                    <h3>Producción Seleccionada</h3>
                    <span>Valor: {dataLabel}</span><br />
                    <span>Grado de Pertenencia:</span>
                    {dataLabel !== undefined && dataVL && dataVL.pertenencia ? (
                        <div>
                            <span>Baja: {dataVL.pertenencia.baja}</span><br />
                            <span>Media: {dataVL.pertenencia.media}</span><br />
                            <span>Alta: {dataVL.pertenencia.alta}</span>
                        </div>
                    ) : (
                        <span>No se han calculado grados de pertenencia</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogicaDifusaChart;
