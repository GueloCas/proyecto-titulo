import React, { useEffect, useState } from 'react';
import { PCTablaDiaHora } from '../components/PCTablaDiaHora';
import { Link, useSearchParams } from 'react-router-dom';
import { getEstacionesByUser } from '../api/estacion.api';
import { anios, meses } from '../utils/dateHelpers';

export function PercepcionesSegundoGradoDiaHoraPage() {
    const [estaciones, setEstaciones] = useState([]);
    const [selectedEstacion, setSelectedEstacion] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState(""); // Se mantiene el selector de mes
    const [selectedDia, setSelectedDia] = useState(""); // Selección del día (1-31)
    const [selectedHora, setSelectedHora] = useState(""); // Selección de la hora (0-23)
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
                    console.log("estacion encontrado en URL:", estacionFromUrl);
                    setSelectedEstacion(estacionFromUrl);
                    setSelectedAnio(anios[0]);
                    setSelectedMes(meses[0].value);
                    setSelectedDia("1");
                    setSelectedHora("8");
                }
            } catch (error) {
                setMensajeError("Hubo un error al cargar las estaciones.");
            }
        }
        loadEstaciones();
    }, []);

    // Opciones de días (1-31)
    const dias = Array.from({ length: 31 }, (_, i) => i + 1);
    const horas = Array.from({ length: 16 }, (_, i) => i + 8); // Horas de 8 a 23

    const isFormValid = selectedEstacion && selectedAnio && selectedMes && selectedDia && selectedHora;

    const handleSearch = () => {
        if (isFormValid) {
            setSearchParams({ estacion: selectedEstacion, anio: selectedAnio, mes: selectedMes, dia: selectedDia, hora: selectedHora }); // Actualizar parámetros de búsqueda
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
                    <h1 className="mb-0 fw-bold">Percepciones Segundo Grado por Día y Hora</h1>
                    <div className="d-flex justify-content-right align-items-end">
                        <Link to={`/percepciones-segundo-grado/dia`} className="text-decoration-none">
                            <button
                                className="btn btn-outline-secondary ms-4"
                            >
                                Ver por Día
                            </button>
                        </Link>
                        <Link to={`/percepciones-segundo-grado`} className="text-decoration-none">
                            <button
                                className="btn btn-secondary ms-4"
                            >
                                Volver
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item">
                            <Link to="/dashboard">Dashboard</Link>
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
                                                style={{ width: '200px' }}  // Definir el ancho aquí
                                                value={selectedEstacion}
                                                onChange={(e) => setSelectedEstacion(e.target.value)}
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
                                                style={{ width: '200px' }}  // Definir el ancho aquí
                                                value={selectedAnio}
                                                onChange={(e) => setSelectedAnio(e.target.value)}
                                            >
                                                <option value="" disabled>Seleccione un año</option>
                                                {anios.map((anio) => (
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
                                                style={{ width: '200px' }}  // Definir el ancho aquí
                                                value={selectedMes}
                                                onChange={(e) => setSelectedMes(e.target.value)}
                                            >
                                                <option value="" disabled>Seleccione un mes</option>
                                                {meses.map((mes) => (
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
                                                onChange={(e) => setSelectedDia(e.target.value)}
                                            >
                                                <option value="" disabled>Seleccione un día</option>
                                                {dias.map((dia) => (
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
                                                style={{ width: '200px' }}  // Definir el ancho aquí
                                                value={selectedHora}
                                                onChange={(e) => setSelectedHora(e.target.value)}
                                            >
                                                <option value="" disabled>Seleccione una hora</option>
                                                {horas.map((hora) => (
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
