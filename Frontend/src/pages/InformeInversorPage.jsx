import { useEffect, useState } from "react";
import { getInversores } from "../api/inversor.api";
import { Link } from "react-router-dom";
import GenerarPDF from "../components/InformeInversorPDF";
import { anios, meses } from "../utils/dateHelpers";

export function InformeInversorPage() {
    const [inversores, setInversores] = useState([]);
    const [selectedInversor, setSelectedInversor] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        async function loadInversores() {
            try {
                const data = await getInversores();
                setInversores(data);
            } catch (error) {
                setMensajeError("Hubo un error al cargar la información.");
            }
        }
        loadInversores();
    }, []);

    const isFormValid = selectedInversor && selectedAnio && selectedMes ? true : false;

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h1 className="mb-0 fw-bold">Generar Informe de Inversor</h1>
                    <Link to="/informes"><button className="btn btn-primary">Volver</button></Link>
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
                            Por Inversor
                        </li>
                    </ol>
                </nav>

                {/* Mostrar mensaje de error */}
                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

                <div className="row mt-2 align-items-stretch">
                    <div className="col-md-6 d-flex">
                        <div className="card w-100 h-100">
                            <div className="card-body">
                                <h4 className="card-title mb-4 text-center">Estructura del Informe</h4>
                                <p className="text-primary-kai"><strong>1. Información del Inversor: </strong><span> muestra la información básica del inversor junto con la cantidad total del mes</span></p>
                                <p className="text-primary-kai"><strong>2. Días con Mayor Producción: </strong><span> muestra los 3 días con mayor producción del mes</span></p>
                                <p className="text-primary-kai"><strong>3. Días con Menor Producción: </strong><span> muestra los 3 días con menor producción del mes</span></p>
                                <p className="text-primary-kai"><strong>4. Producción por Hora: </strong><span> muestra el cantidad promedio, máxima y mínima en cada hora durante el mes</span></p>
                                <p className="text-primary-kai"><strong>5. Comparación con el resto de inversores: </strong><span> muestra la producción total del inversor y la producción total de todos los inversores</span></p>
                                <p className="text-primary-kai"><strong>6. Resumen Percepciones:</strong><span> muestra el resumen de las percepciones del inversor, mostrando el porcentaje de cada conjunto</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex">
                        <div className="card w-100 h-100 text-center">
                            <div className="card-body">
                                <h4 className="card-title mb-4">Selecciona los Datos</h4>
                                <div className="text-center">
                                    <div className="px-2 my-2">
                                        <label className="form-label">Inversor</label>
                                        <select
                                            className="form-select mx-auto"
                                            style={{ width: '200px' }}
                                            value={selectedInversor}
                                            onChange={(e) => setSelectedInversor(e.target.value)}
                                        >
                                            <option value="" disabled>Seleccione un Inversor</option>
                                            {inversores.map((inversor) => (
                                                <option key={inversor.id} value={inversor.id}>
                                                    {inversor.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="px-2 my-2">
                                        <label className="form-label">Año</label>
                                        <select
                                            className="form-select mx-auto"
                                            style={{ width: '200px' }}
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

                                    <div className="px-2 my-2">
                                        <label className="form-label">Mes</label>
                                        <select
                                            className="form-select mx-auto"
                                            style={{ width: '200px' }}
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

                                    <GenerarPDF inversor={selectedInversor} anio={selectedAnio} mes={selectedMes} mostrarBoton={isFormValid}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}