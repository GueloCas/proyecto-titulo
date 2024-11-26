import { useEffect, useState } from "react";
import { getPercepcionesPrimerGradoDia } from "../api/percepciones.api";
import { Link } from "react-router-dom";

export function PCPrimerGradoDia({ inversorId, anio, mes, dia }) {
    const [percepciones, setPercepciones] = useState([]);
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        async function obtenerPC() {
            try {
                const data = await getPercepcionesPrimerGradoDia(inversorId, dia);
                console.log(data);
                setPercepciones(data);
            } catch (error) {
                setMensajeError("Hubo un error al cargar las Percepciones.");
            }
        }
        obtenerPC();
    }, [inversorId, dia]);

    return (
        <div>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Hora</th>
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
                                <td>{percepcion.Hora}</td>
                                <td>{percepcion.cantidad}</td>
                                <td>{percepcion.pertenencia.baja.toFixed(2)}</td>
                                <td>{percepcion.pertenencia.media.toFixed(2)}</td>
                                <td>{percepcion.pertenencia.alta.toFixed(2)}</td>
                                <td style={{ backgroundColor: '#c0c0c0' }}>
                                    <Link to={`/ProduccionInversor/VLinguisticas?hora=${percepcion.Hora}&cantidad=${percepcion.cantidad}&inversor=${inversorId}&dia=${dia}`} className="text-dark text-decoration-none d-flex justify-content-center">
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