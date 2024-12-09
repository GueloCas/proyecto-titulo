import { useEffect, useState } from "react";
import { getPercepcionesPrimerGrado } from "../api/percepciones.api";
import ApexCharts from "apexcharts";

export function ModalLogicaDifusa({ inversor, anio, mes, dia, hora, onClose }) {
    const [percepciones, setPercepciones] = useState(null);
    const [dataLabel, setDataLabel] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPercepciones() {
            try {
                console.log(inversor, anio, mes, dia, hora);
                const data = await getPercepcionesPrimerGrado(inversor, anio, mes, dia, hora);
                console.log(data);
                setPercepciones(data);
                setDataLabel(data.valor);
            } catch (error) {
                setError("Hubo un error al cargar las percepciones.");
            }
        }
        loadPercepciones();
    }, [inversor, anio, mes, dia, hora]);

    useEffect(() => {
        if (!percepciones) return;

        const bajo = [
            [percepciones.TLbaja[0], 1],
            [percepciones.TLbaja[1], 1],
            [percepciones.TLbaja[2], 1],
            [percepciones.TLbaja[3], 0],
        ];

        const medio = [
            [percepciones.TLmedia[0], 0],
            [percepciones.TLmedia[1], 1],
            [percepciones.TLmedia[2], 1],
            [percepciones.TLmedia[3], 0],
        ];

        const alto = [
            [percepciones.TLalta[0], 0],
            [percepciones.TLalta[1], 1],
            [percepciones.TLalta[2], 1],
            [percepciones.TLalta[3], 1],
        ];

        let gradoSeleccionado = { baja: 0, media: 0, alta: 0 };

        if (dataLabel !== null) {
            gradoSeleccionado = percepciones.pertenencia;
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
            colors: ['#F25961', '#FFAD46', '#31CE36', '#1572E8'],
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
                min: percepciones.min,
                max: percepciones.max,
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

        const chartContainer = document.querySelector("#chart");
        const chart = new ApexCharts(chartContainer, options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }, [percepciones, dataLabel]);

    return (
        <>
            {/* Modal Backdrop con fondo oscuro */}
            <div
                className="modal-backdrop fade show"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",  // Fondo oscuro
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1040,  // Asegúrate de que esté detrás del modal
                }}
            ></div>

            {/* Modal */}
            <div className="modal fade show d-block" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ zIndex: 1050 }}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Gráfico de Percepción 1° Inversor <strong>{percepciones ? percepciones.inversor : ''}</strong></h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div id="chart"></div>
                            <div className="text-center">
                                <span className="badge" style={{ backgroundColor: percepciones?.pertenencia.baja > 0 ? '#F25961' : '#ddd', margin: '0 5px', fontSize: '18px' }}>
                                    Baja: {percepciones?.pertenencia.baja.toFixed(2)}
                                </span>
                                <span className="badge" style={{ backgroundColor: percepciones?.pertenencia.media > 0 ? '#FFAD46' : '#ddd', margin: '0 5px', fontSize: '18px' }}>
                                    Media: {percepciones?.pertenencia.media.toFixed(2)}
                                </span>
                                <span className="badge" style={{ backgroundColor: percepciones?.pertenencia.alta > 0 ? '#31CE36' : '#ddd', margin: '0 5px', fontSize: '18px' }}>
                                    Alta: {percepciones?.pertenencia.alta.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );


}