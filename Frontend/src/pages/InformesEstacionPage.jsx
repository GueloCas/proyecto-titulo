import { Link } from "react-router-dom";
import { getEstaciones } from "../api/estacion.api";
import { useEffect, useState } from "react";

export function InformesEstacionPage() {
    const [estaciones, setEstaciones] = useState([]);
    const [selectedEstacion, setSelectedEstacion] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState("");
    const [mensajeError, setMensajeError] = useState("");

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
        { value: "12", label: "Diciembre" },
    ];

    return (
        <div className="container">
            <div className="page-inner">
                {/* Título y botón */}
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h1 className="mb-0 fw-bold">Informes por Estación</h1>
                    <Link to="/resumenes">
                        <button className="btn btn-primary">Volver</button>
                    </Link>
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
                            Estación
                        </li>
                    </ol>
                </nav>

                {/* Mostrar mensaje de error */}
                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

                {/* Selectores */}
                <div className="card px-4 pt-3">
                    <div className="row mb-4">
                        <div className="col-md-2">
                            <label className="form-label">Estación</label>
                            <select
                                className="form-select"
                                value={selectedEstacion}
                                onChange={(e) => setSelectedEstacion(e.target.value)}
                            >
                                <option value="" disabled>
                                    Seleccione una estación
                                </option>
                                {estaciones.map((estacion) => (
                                    <option key={estacion.id} value={estacion.id}>
                                        {estacion.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Año</label>
                            <select
                                className="form-select"
                                value={selectedAnio}
                                onChange={(e) => setSelectedAnio(e.target.value)}
                            >
                                <option value="" disabled>
                                    Seleccione un año
                                </option>
                                {anios.map((anio) => (
                                    <option key={anio} value={anio}>
                                        {anio}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Mes</label>
                            <select
                                className="form-select"
                                value={selectedMes}
                                onChange={(e) => setSelectedMes(e.target.value)}
                            >
                                <option value="" disabled>
                                    Seleccione un mes
                                </option>
                                {meses.map((mes) => (
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
    );
}
