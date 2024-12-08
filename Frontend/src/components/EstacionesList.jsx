import { useEffect, useState } from "react";
import { deleteEstacion, getEstaciones, getEstacionesByUser } from "../api/estacion.api";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export function EstacionesList() {
  const [estaciones, setEstaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Obtener el parámetro de búsqueda de la URL si está presente
    const params = new URLSearchParams(location.search);
    const initialSearch = params.get("buscar") || "";
    setSearchTerm(initialSearch);

    const fetchEstaciones = async () => {
      const data = await getEstaciones();
      setEstaciones(data);
    };
    fetchEstaciones();
  }, [location.search]);

  // Filtra los estaciones según el término de búsqueda
  const filteredEstaciones = estaciones.filter((estacion) =>
    estacion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteEstacion = (id) => {
    return async () => {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Toda la información relacionada con esta estación será eliminada.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          await deleteEstacion(id);
          const data = await getEstacionesByUser();
          setEstaciones(data.estaciones);
          Swal.fire(
            'Eliminada',
            'La estación y toda su información relacionada han sido eliminadas.',
            'success'
          );
        } catch (error) {
          Swal.fire(
            'Error',
            'Ocurrió un error al intentar eliminar la estación. Por favor, inténtelo de nuevo.',
            'error'
          );
        }
      }
    };
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          placeholder="Buscar..."
          className="form-control w-25"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive-e" style={{ position: "relative"}}>
        {filteredEstaciones.length === 0 ? (
          <div className="alert alert-warning" role="alert">
            No existen estaciones
          </div>
        ) : (
          <table className="table table-striped" style={{ position: 'relative' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre de la Estación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstaciones.map((estacion, index) => (
                <tr key={estacion.id}>
                  <td>{index + 1}</td>
                  <td>{estacion.nombre}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/inversores?buscar=${estacion.nombre}`}
                        className="btn btn-primary text-light rounded-3"
                      >
                        Ver Inversores
                      </Link>
                      <div className="btn-group">
                        <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                          Ver Estadísticas
                        </button>
                        <ul className="dropdown-menu" style={{ position: 'absolute', zIndex: '1050' }}>
                          <li><a className="dropdown-item" href={`estadisticas/metricas-estacion/general-dia?estacion=${estacion.id}`}>Métricas Diarias</a></li>
                          <li><a className="dropdown-item" href={`estadisticas/metricas-estacion/general-mes?estacion=${estacion.id}`}>Métricas Mensuales</a></li>
                          <li><a className="dropdown-item" href={`estadisticas/metricas-estacion/hora-dia?estacion=${estacion.id}`}>Métricas Diarias por Hora</a></li>
                          <li><a className="dropdown-item" href={`estadisticas/metricas-estacion/hora-mes?estacion=${estacion.id}`}>Métricas Mensuales por Hora</a></li>
                        </ul>
                      </div>
                      <div className="btn-group">
                        <button type="button" className="btn btn-info dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                          Ver Percepciones
                        </button>
                        <ul className="dropdown-menu" style={{ position: 'absolute', zIndex: '1050' }}>
                          <li><a className="dropdown-item" href={`percepciones-segundo-grado/dia?estacion=${estacion.id}`}>2° por Día</a></li>
                          <li><a className="dropdown-item" href={`percepciones-segundo-grado/dia-hora?estacion=${estacion.id}`}>2° por Día y Hora</a></li>
                        </ul>
                      </div>
                      <Link
                        to={`/resumenes/resumenes-estacion?estacion=${estacion.id}`}
                        className="btn btn-warning text-light rounded-3"
                      >
                        Ver Resumen
                      </Link>
                      <Link
                        to={`/informes/informe-estacion?estacion=${estacion.id}`}
                        className="btn btn-success text-light rounded-3"
                      >
                        Generar Informe
                      </Link>
                      <button
                        onClick={handleDeleteEstacion(estacion.id)}
                        className="btn btn-danger d-flex align-items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash3-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
