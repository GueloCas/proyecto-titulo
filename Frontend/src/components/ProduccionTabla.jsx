import { Link } from "react-router-dom";
import Papa from 'papaparse';
import { useEffect, useState } from "react";
import { getProduccionPorInversor } from "../api/produccion.api";

export function ProduccionTabla({ inversor, anio, mes }) {
    const [produccion, setProduccion] = useState([]);
    const [nombreInversor, setNombreInversor] = useState("");
    const [diasUnicos, setDiasUnicos] = useState([]);
    const [horasUnicas, setHorasUnicas] = useState([]);

    useEffect(() => {
        async function loadProduccion() {
            const data = await getProduccionPorInversor(inversor);

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
    }, [inversor]);

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
            <div className="table-responsive mt-4" style={{ overflowX: 'auto' }}>
                <table className="mb-0 table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Hora/Día</th>
                            {diasUnicos.map(dia => (
                                <th key={dia}>{dia}</th>
                            ))}
                            <th>Gráf.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {horasUnicas.map(hora => (
                            <tr key={hora}>
                                <td>{hora}</td>
                                {diasUnicos.map(dia => {
                                    const produccionDiaHora = produccion.find(p => p.Dia === dia && p.Hora === hora);
                                    return (
                                        <td key={dia}>
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
                                <td style={{ backgroundColor: '#c0c0c0' }}>
                                    <Link to={`/inversor/${inversor}/produccion/grafico?hora=H${hora}`} className="text-dark text-decoration-none d-flex justify-content-center">
                                        Ver
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="ms-1 bi bi-graph-up text-dark" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                                        </svg>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={exportToCSV} className="btn btn-info mt-1">
                Descargar CSV
            </button>
        </div>
    );
}
