import { useEffect, useState } from "react";
import { getProduccionPorInversor } from "../api/inversores.api";

export function ProduccionTabla(req) {
    const [produccion, setProduccion] = useState([]);
    const [diasUnicos, setDiasUnicos] = useState([]);
    const [horasUnicas, setHorasUnicas] = useState([]);

    useEffect(() => {
        async function loadProduccion() {
            const data = await getProduccionPorInversor(req.id);
            setProduccion(data);

            // Extraer días y horas únicos
            const dias = [...new Set(data.map(produccion => produccion.Dia))].sort();
            const horas = [...new Set(data.map(produccion => produccion.Hora))];
            
            setDiasUnicos(dias);
            setHorasUnicas(horas);
        }
        loadProduccion();
    }, [req.id]);

    return (
        <div>
            <h1>Producción de inversor {req.id}</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Hora/Día</th>
                        {diasUnicos.map(dia => (
                            <th key={dia}>{dia}</th>
                        ))}
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
