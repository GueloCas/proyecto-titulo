import { useEffect, useState } from "react";
import { getEstaciones } from "../api/estacion.api";
import { Link } from "react-router-dom";
import { MetricasEstacionHoraDia } from "../components/MetricasEstacionHoraDia";

export function MetricasEstacionHoraDiaPage() {
    const [estaciones, setEstaciones] = useState([]);
    const [selectedEstacion, setSelectedEstacion] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState(""); // Se mantiene el selector de mes
    const [selectedDia, setSelectedDia] = useState(""); // Selección del día (1-31)
    const [selectedHora, setSelectedHora] = useState(""); // Se agrega el selector de hora
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        async function loadEstaciones() {
            try {
                const data = await getEstaciones();
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

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="mb-0 fw-bold">Métricas de Estación - Diario General</h1>
                    <Link to="/estadisticas/metricas-estacion"><button className="btn btn-primary">Volver</button></Link>
                </div>
                {/* Mostrar mensaje de error */}
                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

                {/* Selectores de Estación, Año, Mes y Día */}
                
                        <div className="row justify-content-center">
                            <div className="col-md-2">
                                <label className="form-label">Estación</label>
                                <select
                                    className="form-select"
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

                            <div className="col-md-2">
                                <label className="form-label">Día</label>
                                <select
                                    className="form-select"
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

                            <div className="col-md-2">
                                <label className="form-label">Hora</label>
                                <select
                                    className="form-select"
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
                        </div>

                {/* Componente de métricas, pasando los valores seleccionados */}
                <MetricasEstacionHoraDia
                    estacionId={selectedEstacion}
                    anio={selectedAnio}
                    mes={selectedMes}  // Se pasa el mes
                    dia={selectedDia}  // Se pasa el día
                    hora={selectedHora}  // Se mantiene la hora vacía
                />
            </div>
        </div>
    );
}
