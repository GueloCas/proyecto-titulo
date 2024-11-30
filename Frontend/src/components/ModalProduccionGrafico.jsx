import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

export function ModalProduccionGrafico({ nombreInv, mes, anio, horaSeleccionada, diaSeleccionado, datos, onClose }) {
    useEffect(() => {
        let filteredData = [];

        // Si hay una hora seleccionada, filtrar los datos por hora
        

        // Configuración del gráfico
        const series = [{
            name: "Producción",
            data: datos.map(d => d.cantidad),
        }];

        const options = {
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
                text: diaSeleccionado
                    ? `Producción por hora el día ${diaSeleccionado}`
                    : `Producción por día en la hora ${horaSeleccionada} - ${mes}-${anio}`,
                align: "center",
            },
            xaxis: {
                categories: datos.map(d => d.dia || d.hora),  // Mostrar días o horas según la selección
                title: { text: diaSeleccionado ? "Horas del día" : "Días del mes" },
            },
            yaxis: {
                title: { text: "Producción" },
                min: 0,
                max: Math.max(...datos.map(d => d.cantidad)) + 1,
            },
        };

        // Renderiza el gráfico solo si hay datos y el modal está activo
        const chartElement = document.querySelector("#chart");
        if (chartElement) {
            const chart = new ApexCharts(chartElement, { ...options, series });
            chart.render();

            // Limpia el gráfico al desmontar
            return () => {
                chart.destroy();
            };
        }
    }, [horaSeleccionada, diaSeleccionado, datos, mes, anio]);

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
                            <h5 className="modal-title">Gráfico de Producción Inversor <strong>{nombreInv}</strong></h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div id="chart"></div>
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
