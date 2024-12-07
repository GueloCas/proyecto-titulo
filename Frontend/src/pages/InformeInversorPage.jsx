import { useEffect, useState } from "react";
import { getInversoresByUser } from "../api/inversor.api";
import { Link, useSearchParams } from "react-router-dom";
import GenerarPDF from "../components/InformeInversorPDF";
import { getAnioByInversor, getMesByAnioInversor } from "../api/filtros.api";

export function InformeInversorPage() {
    const [inversores, setInversores] = useState([]);
    const [aniosDisponibles, setAniosDisponibles] = useState([]);
    const [mesesDisponibles, setMesesDisponibles] = useState([]);
    const [selectedInversor, setSelectedInversor] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [urlParams, setUrlParams] = useSearchParams();

    useEffect(() => {
        async function loadInversores() {
            try {
                const data = await getInversoresByUser();
                setInversores(data.inversores);

                const inversorFromUrl = urlParams.get("inversor");
                if (inversorFromUrl && data.inversores.some((inv) => inv.id.toString() === inversorFromUrl)) {
                    setSelectedInversor(inversorFromUrl);
                    handleInversorChange(inversorFromUrl);
                }
            } catch (error) {
                setMensajeError("Hubo un error al cargar la información.");
            }
        }
        loadInversores();
    }, []);

    const handleInversorChange = async (inversorId) => {
        setSelectedInversor(inversorId);
        setSelectedAnio("");
        setSelectedMes("");
        setAniosDisponibles([]);
        setMesesDisponibles([]);

        try {
            const data = await getAnioByInversor(inversorId);
            setAniosDisponibles(data.anios);
        } catch (error) {
            setMensajeError("Hubo un error al cargar los años.");
        }
    };

    const handleAnioChange = async (anio) => {
        setSelectedAnio(anio);
        setSelectedMes("");
        setMesesDisponibles([]);

        try {
            const data = await getMesByAnioInversor(selectedInversor, anio);
            setMesesDisponibles(data.meses);
        } catch (error) {
            setMensajeError("Hubo un error al cargar los meses.");
        }
    };

    const isFormValid = selectedInversor && selectedAnio && selectedMes;

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h1 className="mb-0 fw-bold">Generar Informe de Inversor</h1>
                    <Link to="/informes"><button className="btn btn-secondary">Volver</button></Link>
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
                                <p className="text-primary-kai"><strong>2. Producción Diaria: </strong><span> muestra el promedio diario de producción y la cantidad total de producción por día en el mes</span></p>
                                <p className="text-primary-kai"><strong>3. Estadísticas por Hora: </strong><span> muestra la cantidad promedio, máxima y mínima en cada hora durante el mes</span></p>
                                <p className="text-primary-kai"><strong>4. Comparación con  inversores: </strong><span> compara la cantidad total de producción en el mes con el resto de inversores de la estación asociada</span></p>
                                <p className="text-primary-kai"><strong>5. Resumen:</strong><span> muestra el resumen de las percepcines de primer grado en el mes del inversor</span></p>
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
                                            style={{ width: "200px" }}
                                            value={selectedInversor}
                                            onChange={(e) => handleInversorChange(e.target.value)}
                                        >
                                            <option value="" disabled>Seleccione un inversor</option>
                                            {Object.entries(
                                                inversores.reduce((acc, inversor) => {
                                                    const estacion = inversor.nombre_estacion || "Sin Estación";
                                                    if (!acc[estacion]) acc[estacion] = [];
                                                    acc[estacion].push(inversor);
                                                    return acc;
                                                }, {})
                                            ).map(([estacion, inversores]) => (
                                                <optgroup key={estacion} label={estacion}>
                                                    {inversores.map((inversor) => (
                                                        <option key={inversor.id} value={inversor.id}>
                                                            {inversor.nombre}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="px-2 my-2">
                                        <label className="form-label">Año</label>
                                        <select
                                            className="form-select mx-auto"
                                            style={{ width: "200px" }}
                                            value={selectedAnio}
                                            onChange={(e) => handleAnioChange(e.target.value)}
                                            disabled={!aniosDisponibles.length}
                                        >
                                            <option value="" disabled>
                                                Seleccione un año
                                            </option>
                                            {aniosDisponibles.map((anio) => (
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
                                            style={{ width: "200px" }}
                                            value={selectedMes}
                                            onChange={(e) => setSelectedMes(e.target.value)}
                                            disabled={!mesesDisponibles.length}
                                        >
                                            <option value="" disabled>
                                                Seleccione un mes
                                            </option>
                                            {mesesDisponibles.map((mes, index) => (
                                                <option key={index} value={mes.value}>
                                                    {mes.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <GenerarPDF inversor={selectedInversor} anio={selectedAnio} mes={selectedMes} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}