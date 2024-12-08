import { Link, useSearchParams } from "react-router-dom";
import { getInversoresByUser } from "../api/inversor.api";
import { useEffect, useState } from "react";
import { DescripcionesInversor } from "../components/DescripcionesInversor";
import { getAnioByInversor, getMesByAnioInversor } from "../api/filtros.api";

export function DescripcionesInversorPage() {
    const [inversores, setInversores] = useState([]);
    const [aniosDisponibles, setAniosDisponibles] = useState([]);
    const [mesesDisponibles, setMesesDisponibles] = useState([]);
    const [selectedInversor, setSelectedInversor] = useState("");
    const [selectedAnio, setSelectedAnio] = useState("");
    const [selectedMes, setSelectedMes] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [mostrarMetricas, setMostrarMetricas] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const [searchParams, setSearchParams] = useState(null); // Nuevo estado para los parámetros de búsqueda
    const [urlParams, setUrlParams] = useSearchParams();

    useEffect(() => {
        async function loadInversores() {
            try {
                const data = await getInversoresByUser();
                setInversores(data.inversores);

                // Leer parámetros de la URL
                const inversorFromUrl = urlParams.get("inversor");
                const anioFromUrl = urlParams.get("anio");
                const mesFromUrl = urlParams.get("mes");

                // Si el inversor existe y es válido
                if (inversorFromUrl && data.inversores.some((inv) => inv.id.toString() === inversorFromUrl)) {
                    setSelectedInversor(inversorFromUrl);

                    // Cargar años disponibles
                    const aniosData = await getAnioByInversor(inversorFromUrl);
                    setAniosDisponibles(aniosData.anios);

                    // Si el año existe y es válido
                    if (anioFromUrl && aniosData.anios.includes(parseInt(anioFromUrl))) {
                        setSelectedAnio(anioFromUrl);

                        // Cargar meses disponibles
                        const mesesData = await getMesByAnioInversor(inversorFromUrl, anioFromUrl);
                        setMesesDisponibles(mesesData.meses);

                        // Si el mes existe y es válido
                        if (mesFromUrl && mesesData.meses.some((mes) => mes.value.toString() === mesFromUrl)) {
                            setSelectedMes(mesFromUrl);
                        }
                    }
                }
            } catch (error) {
                setMensajeError("Hubo un error al cargar los datos desde la URL.");
            }
        }

        loadInversores();
    }, [urlParams]);

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

    const handleSearch = () => {
        if (isFormValid) {
            setSearchParams({ inversor: selectedInversor, anio: selectedAnio, mes: selectedMes }); // Actualizar parámetros de búsqueda
            setMostrarMetricas(true);
            setIsAccordionOpen(false); // Cierra el acordeón cuando se hace clic en "Buscar"
            setMensajeError(""); // Limpiar mensajes de error
        } else {
            setMensajeError("Por favor, seleccione todos los campos.");
        }
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h1 className="mb-0 fw-bold">Resúmenes por Inversor</h1>
                    <Link to="/resumenes"><button className="btn btn-secondary">Volver</button></Link>
                </div>

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/resumenes">Resúmenes</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Por Inversor
                        </li>
                    </ol>
                </nav>

                {/* Mostrar mensaje de error */}
                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

                {/* Selectores de Inversor, Año, Mes */}
                <div className="accordion" id="filtrosAccordion" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="filtrosHeader">
                            <button
                                className={`accordion-button  ${isAccordionOpen ? '' : 'collapsed'}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#filtrosContent"
                                aria-expanded={isAccordionOpen}
                                aria-controls="filtrosContent"
                            >
                                Filtros
                            </button>
                        </h2>
                        <div
                            id="filtrosContent"
                            className={`accordion-collapse collapse ${isAccordionOpen ? 'show' : ''}`}
                            aria-labelledby="filtrosHeader"
                            data-bs-parent="#filtrosAccordion"
                        >
                            <div className="accordion-body">
                                <div className="d-flex justify-content-center mb-2">
                                    <div className="d-flex flex-wrap justify-content-center">
                                        <div className="px-2">
                                            <label className="form-label">Inversor</label>
                                            <select
                                                className="form-select"
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

                                        <div className="px-2">
                                            <label className="form-label">Año</label>
                                            <select
                                                className="form-select"
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

                                        <div className="px-2">
                                            <label className="form-label">Mes</label>
                                            <select
                                                className="form-select"
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

                                        <div className="px-2 d-flex align-items-end">
                                            <button
                                                className={`btn ${isFormValid ? 'btn-success' : 'btn-secondary'} w-100`}
                                                onClick={handleSearch}
                                                disabled={!isFormValid}
                                                style={{ width: '200px' }}
                                            >
                                                Buscar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {mostrarMetricas && searchParams && (
                    <DescripcionesInversor
                        inversor={searchParams.inversor}
                        anio={searchParams.anio}
                        mes={searchParams.mes}
                    />
                )}
            </div>
        </div>
    );
}
