import React, { useState } from 'react';
import { PCTablaDia } from '../components/PCTablaDia';
import { Link } from 'react-router-dom';

export function PercepcionesComputacionalesDiaPage() {
    const [dia, setDia] = useState('');
    const [mostrar, setMostrar] = useState(false);
    const [mensajeError, setMensajeError] = useState('');

    const handleDiaChange = (event) => {
        setDia(event.target.value);
    };

    const handleObtenerPC = () => {
        if (!dia) {
            setMensajeError('Por favor, selecciona un día.');
            setMostrar(false); // Oculta la tabla si no hay selección
        } else {
            setMensajeError(''); // Resetea el mensaje de error
            setMostrar(true); // Muestra la tabla
        }
    };

    const month = "Aug"; // Mes estático
    const year = 2022; // Año estático

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex my-2 justify-content-between align-items-center">
                    <h1 className="mb-3 mt-2 fw-bold">Percepciones Computacionales por Día</h1>
                    <div className="d-flex justify-content-right align-items-end">
                        <Link to={`/PercepcionesComputacionalesDiaHora`} className="text-decoration-none">
                            <button
                                className="btn btn-outline-secondary ms-4"
                            >
                                Ver por Día y Hora
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
                    <div className='d-flex align-items-end'>
                        <button className="btn btn-primary ms-3 btn-sm" onClick={handleObtenerPC}>Obtener PC</button>
                    </div>
                </div>
                {mostrar && <PCTablaDia dia={dia} />}
            </div>
        </div>
    );
}
