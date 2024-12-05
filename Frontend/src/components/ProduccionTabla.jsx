import { Link } from "react-router-dom";
import Papa from 'papaparse';
import { useEffect, useState } from "react";
import { getProduccionPorInversor } from "../api/produccion.api";
import { ModalProduccionGrafico } from "./ModalProduccionGrafico";
import 'bootstrap-icons/font/bootstrap-icons.css';

export function ProduccionTabla({ inversor, anio, mes }) {
    const [produccion, setProduccion] = useState([]);
    const [nombreInversor, setNombreInversor] = useState("");
    const [diasUnicos, setDiasUnicos] = useState([]);
    const [horasUnicas, setHorasUnicas] = useState([]);
    const [modalData, setModalData] = useState({ visible: false, hora: null, datos: [] });

    useEffect(() => {
        async function loadProduccion() {
            const data = await getProduccionPorInversor(inversor, anio, mes);

            // `data` incluye 'nombre_inversor' y 'producciones'
            setNombreInversor(data.nombre_inversor);  // Guarda el nombre del inversor
            setProduccion(data.producciones);  // Guarda las producciones

            // Extraer días y horas únicos
            const dias = [...new Set(data.producciones.map(produccion => produccion.Dia))].sort();
            const horas = [...new Set(data.producciones.map(produccion => produccion.Hora))];

            setDiasUnicos(dias);
            setHorasUnicas(horas);
        }
        loadProduccion();
    }, [inversor, anio, mes]);

    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, []);

    // Función para manejar la apertura del modal
    const abrirModal = (aux, data) => {
        if (aux === "hora") {
            const datosHora = diasUnicos.map(dia => {
                const produccionDiaHora = produccion.find(p => p.Dia === dia && p.Hora === data);
                return { dia, cantidad: produccionDiaHora ? produccionDiaHora.cantidad : 0 };
            });
            setModalData({ visible: true, hora: data, dia: false, datos: datosHora });
        } else {
            const datosDia = horasUnicas.map(hora => {
                const produccionDiaHora = produccion.find(p => p.Dia === data && p.Hora === hora);
                return { hora, cantidad: produccionDiaHora ? produccionDiaHora.cantidad : 0 };
            });
            setModalData({ visible: true, hora: false, dia: data, datos: datosDia });
        }
    };

    const cerrarModal = () => {
        setModalData({ visible: false, hora: null, datos: [] });
    };

    const exportToCSV = () => {
        // Crear los encabezados: Hora/Día + días únicos
        const csvRows = [];

        // Primera fila (encabezados)
        const headers = ["Hora/Día", ...diasUnicos];
        csvRows.push(headers);

        // Filas de datos (hora como la primera columna)
        horasUnicas.forEach(hora => {
            const row = [hora];

            diasUnicos.forEach(dia => {
                const produccionDiaHora = produccion.find(p => p.Dia === dia && p.Hora === hora);
                row.push(produccionDiaHora ? produccionDiaHora.cantidad : "-");
            });

            // Agregar la fila al CSV
            csvRows.push(row);
        });

        // Convertir los datos a CSV
        const csv = Papa.unparse(csvRows);

        // Crear un blob de los datos CSV
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Crear un enlace temporal para descargar el archivo
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", "produccion-" + nombreInversor + ".csv");

        // Simular un clic para descargar el archivo
        link.click();
    };

    return (
        <div>
            <style>
                {`
                    .table-hover tbody tr td:hover {
                        font-weight: bold; /* Cambia el texto a negrita */
                        background-color: #f0f8ff; /* Cambia el color de fondo */
                    }
                `}
            </style>
            <div className="card p-4 mt-4">
                <div className="card-header d-flex justify-content-between mb-2 align-items-center">
                    <h4 className="ms-2">
                        Tabla producción del inversor: <strong>{nombreInversor}</strong> el mes <strong>{mes}-{anio}</strong>
                        {/* Icono con Tooltip */}
                        <i
                            className="bi bi-info-circle ms-2"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Presiona una hora para ver gráfico con la producción en esa hora en el mes, o presiona un día para ver la producción por hora en ese día."
                            style={{ fontSize: "1.5rem", cursor: "pointer" }}
                        ></i>
                    </h4>
                    <button onClick={exportToCSV} className="btn btn-info btn-border">
                        Descargar CSV
                    </button>
                </div>
                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table className="mb-0 mt-4 table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Día/Hora</th>
                                {horasUnicas.map(hora => (
                                    <th key={hora}>
                                        <button className="btn p-0" onClick={() => abrirModal("hora", hora)}>
                                            <strong>{hora}</strong>
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {diasUnicos.map(dia => (
                                <tr key={dia}>
                                    <td>
                                        <button className="btn p-0" onClick={() => abrirModal("dia", dia)}>
                                            <strong>{dia}</strong>
                                        </button>
                                    </td>
                                    {horasUnicas.map(hora => {
                                        const produccionDiaHora = produccion.find(p => p.Dia === dia && p.Hora === hora);
                                        return (
                                            <td key={hora}>
                                                {produccionDiaHora ? (
                                                    <Link
                                                        to={`/ProduccionInversor/VLinguisticas?hora=${produccionDiaHora.Hora}&cantidad=${produccionDiaHora.cantidad}&dia=${produccionDiaHora.Dia}&inversor=${inversor}`}
                                                        className="text-dark text-decoration-none d-flex justify-content-center"
                                                    >
                                                        {produccionDiaHora.cantidad}
                                                    </Link>
                                                ) : "-"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal de gráfico */}
                {modalData.visible && (
                    <ModalProduccionGrafico
                        nombreInv={nombreInversor}
                        mes={mes}
                        anio={anio}
                        horaSeleccionada={modalData.hora}
                        diaSeleccionado={modalData.dia}
                        datos={modalData.datos}
                        onClose={cerrarModal}
                    />
                )}
            </div>
        </div>
    );
}
