import { getProduccionPorInversorGrados } from "../api/produccion.api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Papa from 'papaparse';

export function ProduccionGrados({ id }) {
    const [produccion, setProduccion] = useState([]);
    const [diasUnicos, setDiasUnicos] = useState([]);
    const [diaActual, setDiaActual] = useState(0);  // Para controlar el día mostrado

    useEffect(() => {
        async function loadProduccion() {
            const data = await getProduccionPorInversorGrados(id);
            setProduccion(data);
            console.log(data);

            // Extraer días únicos
            const dias = [...new Set(data.map(p => p.Dia))].sort();
            setDiasUnicos(dias);
        }
        loadProduccion();
    }, [id]);

    // Filtrar la producción por el día seleccionado
    const produccionFiltrada = produccion.filter(p => p.Dia === diasUnicos[diaActual]);

    // Función para exportar a CSV
    const exportToCSV = () => {
        const csvData = produccionFiltrada.map(item => ({
            "Dia": item.Dia,
            "Hora": item.Hora,
            "Cantidad": item.cantidad,
            "TLbaja": item.pertenencia.baja,
            "TLmedia": item.pertenencia.media,
            "TLalta": item.pertenencia.alta
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", `produccion_grados_${id}.csv`);
        link.click();
    };

    // Función para navegar entre los días
    const handleDiaAnterior = () => {
        if (diaActual > 0) setDiaActual(diaActual - 1);
    };

    const handleDiaSiguiente = () => {
        if (diaActual < diasUnicos.length - 1) setDiaActual(diaActual + 1);
    };

    return (
        <div className="table-responsive pt-2">
            <div className="d-flex justify-content-center align-items-center mb-2">
                <button onClick={handleDiaAnterior} disabled={diaActual === 0} className="btn btn-primary btn-sm me-3">
                    Día Anterior
                </button>
                <span><strong>Día mostrado:</strong></span>
                <select 
                    value={diasUnicos[diaActual]} 
                    onChange={(e) => setDiaActual(diasUnicos.indexOf(e.target.value))}
                    className="form-select mx-3"
                    style={{ width: '20%' }}
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
                        <th>TLbaja</th>
                        <th>TLmedia</th>
                        <th>TLalta</th>
                        <th>Ver TL</th>
                    </tr>
                </thead>
                <tbody>
                    {produccionFiltrada.map((prod, index) => {
                        return (
                            <tr key={index}>
                                <td>{prod.Hora}</td>
                                <td>{prod.cantidad}</td>
                                <td>{prod.pertenencia.baja.toFixed(2)}</td>
                                <td>{prod.pertenencia.media.toFixed(2)}</td>
                                <td>{prod.pertenencia.alta.toFixed(2)}</td>
                                <td style={{ backgroundColor: '#c0c0c0' }}>
                                    <Link to={`/ProduccionInversor/VLinguisticas?hora=${prod.Hora}&cantidad=${prod.cantidad}&inversor=${id}&dia=${diaActual + 1}`} className="text-dark text-decoration-none d-flex justify-content-center">
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
