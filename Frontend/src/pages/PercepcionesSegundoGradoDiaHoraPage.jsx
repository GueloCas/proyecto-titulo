import React, { useEffect, useState } from 'react';
import { PCTablaDiaHora } from '../components/PCTablaDiaHora';
import { Link, useSearchParams } from 'react-router-dom';
import { getEstacionesByUser } from '../api/estacion.api';
import { getAnioByEstacion, getMesByAnioEstacion, getDiaByMesAnioEstacion, getHoraByDiaMesAnioEstacion } from "../api/filtros.api";

export function PercepcionesSegundoGradoDiaHoraPage() {
    const [estaciones, setEstaciones] = useState([]);
    const [aniosDisponibles, setAniosDisponibles] = useState([]);
    const [mesesDisponibles, setMesesDisponibles] = useState([]);
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [horasDisponibles, setHorasDisponibles] = useState([]);
    const [selectedEstacion, setSelectedEstacion] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState(""); 
    const [selectedDia, setSelectedDia] = useState(""); 
    const [selectedHora, setSelectedHora] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [mostrar, setMostrar] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const [searchParams, setSearchParams] = useState(null);
    const [urlParams, setUrlParams] = useSearchParams();

    useEffect(() => {
        async function loadEstaciones() {
            try {
                const data = await getEstacionesByUser();
                setEstaciones(data.estaciones);

                const estacionFromUrl = urlParams.get("estacion");
                if (estacionFromUrl && data.estaciones.some((inv) => inv.id.toString() === estacionFromUrl)) {
                    setSelectedEstacion(estacionFromUrl);
                    handleEstacionChange(estacionFromUrl);
                }
            } catch (error) {
                setMensajeError("Hubo un error al cargar las estaciones.");
            }
        }
        loadEstaciones();
    }, []);

    const handleEstacionChange = async (estacionId) => {
        setSelectedEstacion(estacionId);
        setSelectedAnio("");
        setSelectedMes("");
        setSelectedDia("");
        setSelectedHora("");
        setAniosDisponibles([]);
        setMesesDisponibles([]);
        setDiasDisponibles([]);
        setHorasDisponibles([]);

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
        setSelectedDia("");
        setSelectedHora("");
        setMesesDisponibles([]);
        setDiasDisponibles([]);
        setHorasDisponibles([]);

        try {
            const data = await getMesByAnioEstacion(selectedEstacion, anio);
            setMesesDisponibles(data.meses);
        } catch (error) {
            setMensajeError("Hubo un error al cargar los meses.");
        }
    };

    const handleMesChange = async (mes) => {
        setSelectedMes(mes);
        setSelectedDia("");
        setSelectedHora("");
        setDiasDisponibles([]);
        setHorasDisponibles([]);

        try {
            const data = await getDiaByMesAnioEstacion(selectedEstacion, selectedAnio, mes);
            setDiasDisponibles(data.dias);
        } catch (error) {
            setMensajeError("Hubo un error al cargar los días.");
        }
    };

    const handleDiaChange = async (dia) => {
        setSelectedDia(dia);
        setSelectedHora("");
        setHorasDisponibles([]);

        try {
            const data = await getHoraByDiaMesAnioEstacion(selectedEstacion, selectedAnio, selectedMes, dia);
            setHorasDisponibles(data.horas);
        } catch (error) {
            setMensajeError("Hubo un error al cargar las horas.");
        }
    };

    const isFormValid = selectedEstacion && selectedAnio && selectedMes && selectedDia && selectedHora;

    const handleSearch = () => {
        if (isFormValid) {
            setSearchParams({ estacion: selectedEstacion, anio: selectedAnio, mes: selectedMes, dia: selectedDia, hora: selectedHora }); 
            setMostrar(true);
            setIsAccordionOpen(false);
            setMensajeError(""); 
        } else {
            setMensajeError("Por favor, seleccione todos los campos.");
        }
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex mb-1 justify-content-between align-items-center">
                    <h1 className="mb-0 fw-bold">Percepciones Segundo Grado por Día y Hora</h1>
                    <Link to={`/percepciones-segundo-grado`} className="text-decoration-none">
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
                            <Link to="/editar-perfil">Perfil</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/percepciones-segundo-grado">Percepciones 2°</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Por Día y Hora
                        </li>
                    </ol>
                </nav>

                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

                <div className="accordion" id="filtrosAccordion" style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                                            <label className="form-label">Estación</label>
                                            <select
                                                className="form-select"
                                                style={{ width: '200px' }}  
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

                                        <div className="px-2">
                                            <label className="form-label">Año</label>
                                            <select
                                                className="form-select"
                                                style={{ width: '200px' }}  
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

                                        <div className="px-2">
                                            <label className="form-label">Mes</label>
                                            <select
                                                className="form-select"
                                                style={{ width: '200px' }}  
                                                value={selectedMes}
                                                onChange={(e) => handleMesChange(e.target.value)}
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

                                        <div className="px-2">
                                            <label className="form-label">Día</label>
                                            <select
                                                className="form-select"
                                                style={{ width: '200px' }}
                                                value={selectedDia}
                                                onChange={(e) => handleDiaChange(e.target.value)}
                                                disabled={!diasDisponibles.length}
                                            >
                                                <option value="" disabled>Seleccione un día</option>
                                                {diasDisponibles.map((dia) => (
                                                    <option key={dia} value={dia}>
                                                        {dia}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="px-2">
                                            <label className="form-label">Hora</label>
                                            <select
                                                className="form-select"
                                                style={{ width: '200px' }}  
                                                value={selectedHora}
                                                onChange={(e) => setSelectedHora(e.target.value)}
                                                disabled={!horasDisponibles.length}
                                            >
                                                <option value="" disabled>Seleccione una hora</option>
                                                {horasDisponibles.map((hora) => (
                                                    <option key={hora} value={hora}>
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
                                                style={{ width: '200px' }}  
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
                    <PCTablaDiaHora
                        estacionId={searchParams.estacion}
                        anio={searchParams.anio}
                        mes={searchParams.mes}
                        dia={searchParams.dia}
                        hora={searchParams.hora}
                    />
                )}
            </div>
        </div>
    );
}
