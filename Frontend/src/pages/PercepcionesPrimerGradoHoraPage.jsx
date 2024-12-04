import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getInversoresByUser } from '../api/inversor.api';
import { PCPrimerGradoHora } from '../components/PCPrimerGradoHora';
import { getAnioByInversor, getHoraByMesAnioInversor, getMesByAnioInversor } from "../api/filtros.api";

export function PercepcionesPrimerGradoHoraPage() {
    const [inversores, setInversores] = useState([]);
    const [aniosDisponibles, setAniosDisponibles] = useState([]);
    const [mesesDisponibles, setMesesDisponibles] = useState([]);
    const [horasDisponibles, setHorasDisponibles] = useState([]);
    const [selectedInversor, setSelectedInversor] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState(""); // Se mantiene el selector de mes
    const [selectedHora, setSelectedHora] = useState(""); // Selección del día (1-31)
    const [mensajeError, setMensajeError] = useState("");
    const [mostrar, setMostrar] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const [searchParams, setSearchParams] = useState(null);
    const [urlParams, setUrlParams] = useSearchParams();

    useEffect(() => {
        async function loadInversores() {
            try {
                const data = await getInversoresByUser();
                setInversores(data.inversores);

                const inversorFromUrl = urlParams.get("inversor");
                if (inversorFromUrl && data.inversores.some((inv) => inv.id.toString() === inversorFromUrl)) {
                    setSelectedInversor(inversorFromUrl);
                    handleInversorChange(inversorFromUrl);
                }
            } catch (error) {
                setMensajeError("Hubo un error al cargar las Inversores.");
            }
        }
        loadInversores();
    }, []);

    const handleInversorChange = async (inversorId) => {
        setSelectedInversor(inversorId);
        setSelectedAnio("");
        setSelectedMes("");
        setAniosDisponibles([]);
        setMesesDisponibles([]);
        setHorasDisponibles([]);

        try {
            const data = await getAnioByInversor(inversorId);
            setAniosDisponibles(data.anios);
        } catch (error) {
            setMensajeError("Hubo un error al cargar los años.");
        }
    };

    const handleAnioChange = async (anio) => {
        setSelectedAnio(anio);
        setSelectedMes("");
        setMesesDisponibles([]);
        setHorasDisponibles([]);

        try {
            const data = await getMesByAnioInversor(selectedInversor, anio);
            setMesesDisponibles(data.meses);
        } catch (error) {
            setMensajeError("Hubo un error al cargar los meses.");
        }
    };

    const handleMesChange = async (mes) => {
        setSelectedMes(mes);
        setHorasDisponibles([]);

        try {
            const data = await getHoraByMesAnioInversor(selectedInversor, selectedAnio, mes);
            setHorasDisponibles(data.horas);
        } catch (error) {
            setMensajeError("Hubo un error al cargar las horas.");
        }
    };

    const isFormValid = selectedInversor && selectedAnio && selectedMes && selectedHora;

    const handleSearch = () => {
        if (isFormValid) {
            setSearchParams({ inversor: selectedInversor, anio: selectedAnio, mes: selectedMes, hora: selectedHora }); // Actualizar parámetros de búsqueda
            setMostrar(true);
            setIsAccordionOpen(false); // Cierra el acordeón cuando se hace clic en "Buscar"
            setMensajeError(""); // Limpiar mensajes de error
        } else {
            setMensajeError("Por favor, seleccione todos los campos.");
        }
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex mb-1 justify-content-between align-items-center">
                    <h1 className="mb-0 fw-bold">Percepciones Primer Grado por Hora</h1>
                    <Link to={`/percepciones-primer-grado`} className="text-decoration-none">
                        <button
                            className="btn btn-secondary ms-4"
                        >
                            Volver
                        </button>
                    </Link>
                </div>

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/percepciones-primer-grado">Percepciones 1°</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Por Hora
                        </li>
                    </ol>
                </nav>

                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

                <div className="accordion" id="filtrosAccordion" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="filtrosHeader">
                            <button
                                className={`accordion-button  ${isAccordionOpen ? '' : 'collapsed'}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#filtrosContent"
                                aria-expanded={isAccordionOpen}
                                aria-controls="filtrosContent"
                            >
                                Filtros
                            </button>
                        </h2>
                        <div
                            id="filtrosContent"
                            className={`accordion-collapse collapse ${isAccordionOpen ? 'show' : ''}`}
                            aria-labelledby="filtrosHeader"
                            data-bs-parent="#filtrosAccordion"
                        >
                            <div className="accordion-body">
                                <div className="d-flex justify-content-center mb-2">
                                    <div className="d-flex flex-wrap justify-content-center">
                                    <div className="px-2">
                                            <label className="form-label">Inversor</label>
                                            <select
                                                className="form-select"
                                                style={{ width: "200px" }}
                                                value={selectedInversor}
                                                onChange={(e) => handleInversorChange(e.target.value)}
                                            >
                                                <option value="" disabled>Seleccione un inversor</option>
                                                {Object.entries(
                                                    inversores.reduce((acc, inversor) => {
                                                        const estacion = inversor.nombre_estacion || "Sin Estación";
                                                        if (!acc[estacion]) acc[estacion] = [];
                                                        acc[estacion].push(inversor);
                                                        return acc;
                                                    }, {})
                                                ).map(([estacion, inversores]) => (
                                                    <optgroup key={estacion} label={estacion}>
                                                        {inversores.map((inversor) => (
                                                            <option key={inversor.id} value={inversor.id}>
                                                                {inversor.nombre}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="px-2">
                                            <label className="form-label">Año</label>
                                            <select
                                                className="form-select"
                                                style={{ width: "200px" }}
                                                value={selectedAnio}
                                                onChange={(e) => handleAnioChange(e.target.value)}
                                                disabled={!aniosDisponibles.length}
                                            >
                                                <option value="" disabled>
                                                    Seleccione un año
                                                </option>
                                                {aniosDisponibles.map((anio) => (
                                                    <option key={anio} value={anio}>
                                                        {anio}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="px-2">
                                            <label className="form-label">Mes</label>
                                            <select
                                                className="form-select"
                                                style={{ width: "200px" }}
                                                value={selectedMes}
                                                onChange={(e) => handleMesChange(e.target.value)}
                                                disabled={!mesesDisponibles.length}
                                            >
                                                <option value="" disabled>
                                                    Seleccione un mes
                                                </option>
                                                {mesesDisponibles.map((mes, index) => (
                                                    <option key={index} value={mes.value}>
                                                        {mes.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="px-2">
                                            <label className="form-label">Hora</label>
                                            <select
                                                className="form-select"
                                                style={{ width: '200px' }}  // Definir el ancho aquí
                                                value={selectedHora}
                                                onChange={(e) => setSelectedHora(e.target.value)}
                                                disabled={!horasDisponibles.length}
                                            >
                                                <option value="" disabled>Seleccione una hora</option>
                                                {horasDisponibles.map((hora, index) => (
                                                    <option key={index} value={hora}>
                                                        {hora}:00
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="px-2 d-flex align-items-end">
                                            <button
                                                className={`btn ${isFormValid ? 'btn-success' : 'btn-secondary'} w-100`}
                                                onClick={handleSearch}
                                                disabled={!isFormValid}
                                                style={{ width: '200px' }}  // Definir el ancho aquí
                                            >
                                                Buscar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {mostrar && searchParams && (
                    <PCPrimerGradoHora
                        inversorId={searchParams.inversor}
                        anio={searchParams.anio}
                        mes={searchParams.mes}
                        hora={searchParams.hora}
                    />
                )}
            </div>
        </div>
    );
}
