import { Link } from "react-router-dom";
import Papa from 'papaparse';
import { useEffect, useState } from "react";
import { getProduccionPorInversor } from "../api/produccion.api";

export function ProduccionEstadisticas({ id }) {
    const [produccion, setProduccion] = useState([]);
    const [diasUnicos, setDiasUnicos] = useState([]);
    const [horasUnicas, setHorasUnicas] = useState([]);
    const [estadisticasHora, setEstadisticasHora] = useState([]);
    const [nombreInversor, setNombreInversor] = useState("");
    const [diaActual, setDiaActual] = useState(0);  // Para controlar el día mostrado

    useEffect(() => {
        async function loadProduccion() {
            const data = await getProduccionPorInversor(id);

            setNombreInversor(data.nombre_inversor);
            setProduccion(data.producciones);
            setEstadisticasHora(data.estadisticas_por_hora);

            const dias = [...new Set(data.producciones.map(produccion => produccion.Dia))].sort();
            const horas = [...new Set(data.producciones.map(produccion => produccion.Hora))];
            
            setDiasUnicos(dias);
            setHorasUnicas(horas);
        }
        loadProduccion();
    }, [id]);

    // Función para navegar entre los días
    const handleDiaAnterior = () => {
        if (diaActual > 0) setDiaActual(diaActual - 1);
    };

    const handleDiaSiguiente = () => {
        if (diaActual < diasUnicos.length - 1) setDiaActual(diaActual + 1);
    };

    const exportToCSV = () => {
        const csvData = estadisticasHora.map(item => ({
            [`${nombreInversor}-Hora`]: "H" + item.hora_num,
            "Cantidad Minima": item.cantidad_minima,
            "Cantidad Maxima": item.cantidad_maxima,
            "Cantidad Promedio": item.cantidad_promedio
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", nombreInversor + ".csv");
        link.click();
    };

    // Filtrar la producción por el día seleccionado
    const produccionFiltrada = produccion.filter(p => p.Dia === diasUnicos[diaActual]);

    return (
        <div className="table-responsive pt-2">
            <div className="d-flex justify-content-center align-items-center mb-2">
                <button onClick={handleDiaAnterior} disabled={diaActual === 0} className="btn btn-primary btn-sm me-3">
                    Día Anterior
                </button>
                <span><strong>Día mostrado:</strong></span>
                <select
                    className="form-select mx-3"
                    style={{ width: '20%' }}
                    value={diasUnicos[diaActual]}
                    onChange={(e) => setDiaActual(diasUnicos.indexOf(e.target.value))}
                >
                    {diasUnicos.map((dia, index) => (
                        <option key={index} value={dia}>{dia}</option>
                    ))}
                </select>
                <button onClick={handleDiaSiguiente} disabled={diaActual === diasUnicos.length - 1} className="btn btn-sm btn-primary ms-3">
                    Día Siguiente
                </button>
            </div>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Producción</th>
                        <th>Prom</th>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Ver TL</th>
                    </tr>
                </thead>
                <tbody>
                    {produccionFiltrada.map((prod, index) => {
                        const stat = estadisticasHora.find(s => s.hora_num === parseInt(prod.Hora.replace('H', '')));
                        return (
                            <tr key={index}>
                                <td>{prod.Hora}</td>
                                <td>{prod.cantidad}</td>
                                <td>{stat.cantidad_promedio.toFixed(5)}</td>
                                <td>{stat.cantidad_maxima.toFixed(2)}</td>
                                <td>{stat.cantidad_minima.toFixed(2)}</td>
                                <td style={{ backgroundColor: '#c0c0c0' }}>
                                    <Link to={`/ProduccionInversor/VLinguisticas?hora=${prod.Hora}&cantidad=${prod.cantidad}&inversor=${id}&dia=${diaActual + 1}&min=${stat.cantidad_minima}&max=${stat.cantidad_maxima}`} className="text-dark text-decoration-none d-flex justify-content-center">
                                        Ver TL
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button onClick={exportToCSV} className="btn btn-info">
                Descargar CSV
            </button>
        </div>
    );
}
