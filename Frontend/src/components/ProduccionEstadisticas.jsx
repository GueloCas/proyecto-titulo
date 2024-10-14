import { Link } from "react-router-dom";
import Papa from 'papaparse';

export function ProduccionEstadisticas({ estadisticas, id, nombreInversor }) {
    const exportToCSV = () => {
        // Define los encabezados y datos
        const csvData = estadisticas.map(item => ({
            [`${nombreInversor}-Hora`]: "H" + item.hora_num,
            "Cantidad Minima": item.cantidad_minima,
            "Cantidad Maxima": item.cantidad_maxima,
            "Cantidad Promedio": item.cantidad_promedio
        }));

        // Convierte los datos a formato CSV
        const csv = Papa.unparse(csvData);

        // Crea un blob de los datos CSV
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Crea un enlace temporal para descargar el archivo
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", nombreInversor + ".csv");

        // Simula un clic para descargar el archivo
        link.click();
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Cantidad Mínima</th>
                        <th>Cantidad Máxima</th>
                        <th>Cantidad Promedio</th>
                        <th>Gráfico</th>
                    </tr>
                </thead>
                <tbody>
                    {estadisticas.map((stat, index) => (
                        <tr key={index}>
                            <td>H{stat.hora_num}</td>
                            <td>{stat.cantidad_minima.toFixed(2)}</td>
                            <td>{stat.cantidad_maxima.toFixed(2)}</td>
                            <td>{stat.cantidad_promedio.toFixed(5)}</td>
                            <td style={{ backgroundColor: '#c0c0c0'}}>
                                <Link to={`/ProduccionInversor/grafico/${id}?hora=H${stat.hora_num}`} className="text-dark text-decoration-none d-flex justify-content-center">
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
            <button onClick={exportToCSV} className="btn btn-info">
                Descargar CSV
            </button>
        </div>
    );
}