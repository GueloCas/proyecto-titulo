import { Link } from "react-router-dom";
import { getInversores } from "../api/inversor.api";
import { useEffect, useState } from "react";
import { DescripcionesInversor } from "../components/DescripcionesInversor";

export function DescripcionesInversorPage() {
    const [inversores, setInversores] = useState([]);
    const [selectedInversor, setSelectedInversor] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState(""); // Se mantiene el selector de mes
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        async function loadInversores() {
            try {
                const data = await getInversores();
                console.log(data);
                setInversores(data);
            } catch (error) {
                setMensajeError("Hubo un error al cargar las estaciones.");
            }
        }
        loadInversores();
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

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="mb-0 fw-bold">Descripciones por Inversores</h1>
                    <Link to="/resumenes"><button className="btn btn-primary">Volver</button></Link>
                </div>
                {/* Mostrar mensaje de error */}
                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

                {/* Selectores de Inversor, Año, Mes*/}
                <div className="row mb-4">
                    <div className="col-md-2">
                        <label className="form-label">Inversor</label>
                        <select
                            className="form-select"
                            value={selectedInversor}
                            onChange={(e) => setSelectedInversor(e.target.value)}
                        >
                            <option value="" disabled>Seleccione una Inversor</option>
                            {inversores.map((inversor) => (
                                <option key={inversor.id} value={inversor.id}>
                                    {inversor.nombre}
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
                            <option value="" disabled>Seleccione un año</option>
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
                            <option value="" disabled>Seleccione un mes</option>
                            {meses.map((mes) => (
                                <option key={mes.value} value={mes.value}>
                                    {mes.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <DescripcionesInversor inversor={selectedInversor} anio={selectedAnio} mes={selectedMes} />
            </div>
        </div>
    )
}