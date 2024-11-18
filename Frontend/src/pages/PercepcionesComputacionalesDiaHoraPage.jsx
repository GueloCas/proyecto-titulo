import React, { useState } from 'react';
import { PCTablaDiaHora } from '../components/PCTablaDiaHora';
import { Link } from 'react-router-dom';

export function PercepcionesComputacionalesDiaHoraPage() {
    const [dia, setDia] = useState('');
    const [hora, setHora] = useState('');
    const [mostrar, setMostrar] = useState(false);
    const [mensajeError, setMensajeError] = useState('');

    const handleDiaChange = (event) => {
        setDia(event.target.value);
        setMostrar(false);
    };

    const handleHoraChange = (event) => {
        setHora(event.target.value);
        setMostrar(false);
    };

    const handleObtenerPC = () => {
        if (!dia || !hora) {
            setMensajeError('Por favor, selecciona un día');
            setMostrar(false); // Oculta la tabla si no hay selección
        } else {
            setMensajeError(''); // Resetea el mensaje de error
            setMostrar(true); // Muestra la tabla
        }
    };

    const month = "Aug"; // Mes estático
    const year = 2022; // Año estático

    return (
        <div className="container px-4 pt-2">
            <div className="page-inner">
                <div className="d-flex my-2 justify-content-between align-items-center">
                    <h1 className="mb-3 fw-bold">Percepciones Computacionales por Día y Hora</h1>
                    <div className="d-flex justify-content-right align-items-end">
                        <Link to={`/PercepcionesComputacionalesDia`} className="text-decoration-none">
                            <button
                                className="btn btn-outline-secondary ms-4"
                            >
                                Ver por Día
                            </button>
                        </Link>
                        <Link to={`/PercepcionesComputacionales`} className="text-decoration-none">
                            <button
                                className="btn btn-success ms-4"
                            >
                                Volver
                            </button>
                        </Link>
                    </div>
                </div>
                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}
                <div className="d-flex mb-3 justify-content-start">
                    <div className="me-3">
                        <select id="diaSelect" className="form-select form-select-sm" value={dia} onChange={handleDiaChange}>
                            <option value="">Selecciona un día</option>
                            {Array.from({ length: 31 }, (_, i) => {
                                const day = String(i + 1).padStart(2, '0'); // Asegura que el día tenga 2 dígitos
                                return (
                                    <option key={day} value={`${day}-${month}-${year}`}>
                                        {day}-{month}-{year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <select id="horaSelect" className="form-select form-select-sm" value={hora} onChange={handleHoraChange}>
                            <option value="">Selecciona una hora</option>
                            {Array.from({ length: 15 }, (_, i) => (
                                <option key={i + 8} value={'H' + (i + 8)}>{i + 8}</option>
                            ))}
                        </select>
                    </div>
                    <div className='d-flex align-items-end'>
                        <button className="btn btn-primary ms-3 btn-sm" onClick={handleObtenerPC}>Obtener PC</button>
                    </div>
                </div>

                {mostrar && <PCTablaDiaHora dia={dia} hora={hora} />}
            </div>
        </div>
    );
}



