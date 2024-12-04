import { useEffect, useState } from "react";
import { getEstacionesByUser } from "../api/estacion.api";
import { Link, useSearchParams } from "react-router-dom";
import { getAnioByEstacion, getMesByAnioEstacion } from "../api/filtros.api";

export function InformeEstacionPage() {
    const [estaciones, setEstaciones] = useState([]);
    const [aniosDisponibles, setAniosDisponibles] = useState([]);
    const [mesesDisponibles, setMesesDisponibles] = useState([]);
    const [selectedEstacion, setSelectedEstacion] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [urlParams, setUrlParams] = useSearchParams();

    useEffect(() => {
        async function loadestaciones() {
            try {
                const data = await getEstacionesByUser();
                setEstaciones(data.estaciones);

                const estacionFromUrl = urlParams.get("estacion");
                if (estacionFromUrl && data.estaciones.some((inv) => inv.id.toString() === estacionFromUrl)) {
                    setSelectedEstacion(estacionFromUrl);
                    handleEstacionChange(estacionFromUrl);
                }
            } catch (error) {
                setMensajeError("Hubo un error al cargar la información.");
            }
        }
        loadestaciones();
    }, []);

    const handleEstacionChange = async (estacionId) => {
        setSelectedEstacion(estacionId);
        setSelectedAnio("");
        setSelectedMes("");
        setAniosDisponibles([]);
        setMesesDisponibles([]);

        try {
            const data = await getAnioByEstacion(estacionId);
            setAniosDisponibles(data.anios);
        } catch (error) {
            setMensajeError("Hubo un error al cargar los años.");
        }
    };

    const handleAnioChange = async (anio) => {
        setSelectedAnio(anio);
        setSelectedMes("");
        setMesesDisponibles([]);

        try {
            const data = await getMesByAnioEstacion(selectedEstacion, anio);
            setMesesDisponibles(data.meses);
        } catch (error) {
            setMensajeError("Hubo un error al cargar los meses.");
        }
    };

    const isFormValid = selectedEstacion && selectedAnio && selectedMes ? true : false;

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h1 className="mb-0 fw-bold">Generar Informe de Estación</h1>
                    <Link to="/informes"><button className="btn btn-secondary">Volver</button></Link>
                </div>

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/informes">Informes</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Por Estación
                        </li>
                    </ol>
                </nav>

                {/* Mostrar mensaje de error */}
                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

                <div className="row mt-2 align-items-stretch">
                    <div className="col-md-6 d-flex">
                        <div className="card w-100 h-100">
                            <div className="card-body">
                                <h4 className="card-title mb-4 text-center">Estructura del Informe</h4>
                                <p className="text-primary-kai"><strong>1. Información del Inversor: </strong><span> muestra la información básica del inversor junto con la cantidad total del mes</span></p>
                                <p className="text-primary-kai"><strong>2. Días con Mayor Producción: </strong><span> muestra los 3 días con mayor producción del mes</span></p>
                                <p className="text-primary-kai"><strong>3. Días con Menor Producción: </strong><span> muestra los 3 días con menor producción del mes</span></p>
                                <p className="text-primary-kai"><strong>4. Producción por Hora: </strong><span> muestra el cantidad promedio, máxima y mínima en cada hora durante el mes</span></p>
                                <p className="text-primary-kai"><strong>5. Comparación con el resto de estaciones: </strong><span> muestra la producción total del inversor y la producción total de todos los estaciones</span></p>
                                <p className="text-primary-kai"><strong>6. Resumen Percepciones:</strong><span> muestra el resumen de las percepciones del inversor, mostrando el porcentaje de cada conjunto</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex">
                        <div className="card w-100 h-100 text-center">
                            <div className="card-body">
                                <h4 className="card-title mb-4">Selecciona los Datos</h4>
                                <div className="text-center">
                                    <div className="px-2 my-2">
                                        <label className="form-label">Estación</label>
                                        <select
                                            className="form-select mx-auto"
                                            style={{ width: '200px' }}  // Definir el ancho aquí
                                            value={selectedEstacion}
                                            onChange={(e) => handleEstacionChange(e.target.value)}
                                        >
                                            <option value="" disabled>Seleccione una estación</option>
                                            {estaciones.map((estacion) => (
                                                <option key={estacion.id} value={estacion.id}>
                                                    {estacion.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="px-2 my-2">
                                        <label className="form-label">Año</label>
                                        <select
                                            className="form-select mx-auto"
                                            style={{ width: '200px' }}  // Definir el ancho aquí
                                            value={selectedAnio}
                                            onChange={(e) => handleAnioChange(e.target.value)}
                                            disabled={!aniosDisponibles.length}
                                        >
                                            <option value="" disabled>Seleccione un año</option>
                                            {aniosDisponibles.map((anio) => (
                                                <option key={anio} value={anio}>
                                                    {anio}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="px-2 my-2">
                                        <label className="form-label">Mes</label>
                                        <select
                                            className="form-select mx-auto"
                                            style={{ width: '200px' }}  // Definir el ancho aquí
                                            value={selectedMes}
                                            onChange={(e) => setSelectedMes(e.target.value)}
                                            disabled={!mesesDisponibles.length}
                                        >
                                            <option value="" disabled>Seleccione un mes</option>
                                            {mesesDisponibles.map((mes) => (
                                                <option key={mes.value} value={mes.value}>
                                                    {mes.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}