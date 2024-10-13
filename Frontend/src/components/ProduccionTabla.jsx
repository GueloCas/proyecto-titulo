import { useEffect, useState } from "react";
import { getProduccionPorInversor } from "../api/inversores.api";
import { Link } from "react-router-dom";

export function ProduccionTabla(req) {
    const [produccion, setProduccion] = useState([]);
    const [diasUnicos, setDiasUnicos] = useState([]);
    const [horasUnicas, setHorasUnicas] = useState([]);
    const [nombreInversor, setNombreInversor] = useState(""); // Nueva variable para el nombre del inversor

    const queryParams = new URLSearchParams(location.search);
    const hora = queryParams.get('hora');

    useEffect(() => {
        async function loadProduccion() {
            const data = hora ? await getProduccionPorInversor(req.id, hora) : await getProduccionPorInversor(req.id);

            // Ahora `data` incluirá 'nombre_inversor' y 'producciones'
            setNombreInversor(data.nombre_inversor);  // Guarda el nombre del inversor
            setProduccion(data.producciones);  // Guarda las producciones

            // Extraer días y horas únicos
            const dias = [...new Set(data.producciones.map(produccion => produccion.Dia))].sort();
            const horas = [...new Set(data.producciones.map(produccion => produccion.Hora))];

            setDiasUnicos(dias);
            setHorasUnicas(horas);
        }
        loadProduccion();
    }, [req.id]);

    return (
        <div>
            <div className="mt-1 d-flex justify-content-between align-items-center">
                <h1>Producción de inversor: {nombreInversor}</h1> {/* Mostrando el nombre del inversor */}
                <Link to={`/inversores`} className=" text-decoration-none">
                    <button className="btn btn-success">Volver</button>
                </Link>
            </div>
            <table className="mt-1 table table-bordered ">
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
                                        {produccionDiaHora ? produccionDiaHora.cantidad : "-"}
                                    </td>
                                );
                            })}
                            <td style={{ backgroundColor: '#c0c0c0'}}>
                                <Link to={`/ProduccionInversor/grafico/${req.id}?hora=${hora}`} className="text-secondary text-decoration-none d-flex justify-content-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-graph-up text-dark" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                                    </svg>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

