import React, { useEffect, useState } from 'react';
import { PCTablaDiaHora } from '../components/PCTablaDiaHora';
import { Link } from 'react-router-dom';
import { getEstaciones } from '../api/estacion.api';

export function PercepcionesSegundoGradoDiaHoraPage() {
    const [estaciones, setEstaciones] = useState([]);
    const [selectedEstacion, setSelectedEstacion] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState(""); // Se mantiene el selector de mes
    const [selectedDia, setSelectedDia] = useState(""); // Selección del día (1-31)
    const [selectedHora, setSelectedHora] = useState(""); // Selección de la hora (0-23)
    const [mensajeError, setMensajeError] = useState("");
    const [mostrar, setMostrar] = useState(false);

    useEffect(() => {
        async function loadEstaciones() {
            try {
                const data = await getEstaciones();
                console.log(data);
                setEstaciones(data);
            } catch (error) {
                setMensajeError("Hubo un error al cargar las estaciones.");
            }
        }
        loadEstaciones();
    }, []);

    // Opciones de año
    const anios = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    // Opciones de meses (1-12)
    const meses = [
        { value: "01", label: "Enero" },
        { value: "02", label: "Febrero" },
        { value: "03", label: "Marzo" },
        { value: "04", label: "Abril" },
        { value: "05", label: "Mayo" },
        { value: "06", label: "Junio" },
        { value: "07", label: "Julio" },
        { value: "08", label: "Agosto" },
        { value: "09", label: "Septiembre" },
        { value: "10", label: "Octubre" },
        { value: "11", label: "Noviembre" },
        { value: "12", label: "Diciembre" }
    ];

    // Opciones de días (1-31)
    const dias = Array.from({ length: 31 }, (_, i) => i + 1);
    const horas = Array.from({ length: 16 }, (_, i) => i + 8); // Horas de 8 a 23

    const isFormValid = selectedEstacion && selectedAnio && selectedMes && selectedDia && selectedHora;

    const handleSearch = () => {
        if (isFormValid) {
            setMostrar(true);
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
                                className="btn btn-success ms-4"
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

                <div className="card border-0 px-4 pt-3 mx-auto" style={{ maxWidth: '1200px' }}>
                    <div className="d-flex justify-content-center mb-4">
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

                {mostrar && (
                    <PCTablaDiaHora
                        estacionId={selectedEstacion}
                        anio={selectedAnio}
                        mes={selectedMes}
                        dia={selectedDia}
                        hora={selectedHora}
                    />
                )}
            </div>
        </div>
    );
}
