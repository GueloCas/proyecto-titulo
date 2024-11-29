import { useEffect, useState } from "react";
import { getPercepcionesPrimerGradoHora } from "../api/percepciones.api";
import { Link } from "react-router-dom";

export function PCPrimerGradoHora({ inversorId, anio, mes, hora }) {
    const [percepciones, setPercepciones] = useState([]);
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        async function obtenerPC() {
            setPercepciones(null);
            try {
                const data = await getPercepcionesPrimerGradoHora(inversorId, hora);
                console.log(data);
                setPercepciones(data);
            } catch (error) {
                setMensajeError("Hubo un error al cargar las Percepciones.");
            }
        }
        obtenerPC();
    }, [inversorId, hora]);

    if (!percepciones) {
        return (
            <div className="text-center mt-4 d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span className="ms-2">Cargando...</span>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Día</th>
                        <th>Producción</th>
                        <th>TLbaja</th>
                        <th>TLmedia</th>
                        <th>TLalta</th>
                        <th>Ver TL</th>
                    </tr>
                </thead>
                <tbody>
                    {percepciones.map((percepcion, index) => {
                        return (
                            <tr key={index}>
                                <td>{percepcion.Dia}</td>
                                <td>{percepcion.cantidad}</td>
                                <td>{percepcion.pertenencia.baja.toFixed(2)}</td>
                                <td>{percepcion.pertenencia.media.toFixed(2)}</td>
                                <td>{percepcion.pertenencia.alta.toFixed(2)}</td>
                                <td style={{ backgroundColor: '#c0c0c0' }}>
                                    <Link to={`/ProduccionInversor/VLinguisticas?hora=H${hora}&cantidad=${percepcion.cantidad}&inversor=${inversorId}&dia=${percepcion.Dia}`} className="text-dark text-decoration-none d-flex justify-content-center">
                                        Ver TL
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}