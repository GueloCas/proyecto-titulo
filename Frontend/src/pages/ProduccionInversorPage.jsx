import { Link, useParams } from "react-router-dom";
import { ProduccionTabla } from "../components/ProduccionTabla";
import { ProduccionEstadisticas } from "../components/ProduccionEstadisticas";
import { useEffect, useState } from "react";
import { getProduccionPorInversor } from "../api/inversores.api";

export function ProduccionInversorPage() {
    const { id } = useParams();

    const [produccion, setProduccion] = useState([]);
    const [diasUnicos, setDiasUnicos] = useState([]);
    const [horasUnicas, setHorasUnicas] = useState([]);
    const [estadisticasHora, setEstadisticasHora] = useState([]);
    const [nombreInversor, setNombreInversor] = useState("");
    const [tabla, setTabla] = useState(true);

    useEffect(() => {
        async function loadProduccion() {
            const data = await getProduccionPorInversor(id);

            // `data` incluye 'nombre_inversor' y 'producciones'
            setNombreInversor(data.nombre_inversor);  // Guarda el nombre del inversor
            setProduccion(data.producciones);  // Guarda las producciones
            setEstadisticasHora(data.estadisticas_por_hora);

            // Extraer días y horas únicos
            const dias = [...new Set(data.producciones.map(produccion => produccion.Dia))].sort();
            const horas = [...new Set(data.producciones.map(produccion => produccion.Hora))];

            setDiasUnicos(dias);
            setHorasUnicas(horas);
        }
        loadProduccion();
    }, [id]);

    return (
        <div className="container-fluid px-4 pt-2">
            <div className="mt-1 d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-left align-items-center">
                    <h1>Producción de inversor: {nombreInversor}</h1>
                    <button 
                        className="btn btn-outline-secondary ms-4"
                        style={{ height: "38px" }} 
                        onClick={() => setTabla(!tabla)}>
                        {tabla ? "Ver Estadísticas" : "Ver Tabla"}
                    </button>
                </div>
                <Link to={`/inversores`} className="text-decoration-none">
                    <button className="btn btn-success">Volver</button>
                </Link>
            </div>
    
            {tabla ? (
                <ProduccionTabla produccion={produccion} diasUnicos={diasUnicos} horasUnicas={horasUnicas} id={id} nombreInversor={nombreInversor} />
            ) : (
                <ProduccionEstadisticas estadisticas={estadisticasHora} id={id} nombreInversor={nombreInversor}/>
            )}
        </div>
    );    
}