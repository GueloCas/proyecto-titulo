import { useEffect, useState } from "react";
import { deleteInversor, getInversores, getInversoresByUser } from "../api/inversor.api";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export function InversoresList() {
  const [inversores, setInversores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Obtener el parámetro de búsqueda de la URL si está presente
    const params = new URLSearchParams(location.search);
    const initialSearch = params.get("buscar") || "";
    setSearchTerm(initialSearch);

    async function loadInversores() {
      const data = await getInversoresByUser();
      setInversores(data.inversores);
    }
    loadInversores();
  }, [location.search]);

  const handleDeleteInversor = (id) => {
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
          await deleteInversor(id);
          const data = await getInversoresByUser();
          setInversores(data.inversores);
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

  // Filtra los inversores según el término de búsqueda
  const filteredInversores = inversores.filter((inversor) =>
    inversor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inversor.nombre_estacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          placeholder="Buscar..."
          className="form-control w-25"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive" style={{ position: "relative" }}>
        {filteredInversores.length === 0 ? (
          <div className="alert alert-warning" role="alert">
            No existen inversores
          </div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre del Inversor</th>
                <th>Estación Asociada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInversores.map((inversor, index) => (
                <tr key={inversor.id}>
                  <td>{index + 1}</td>
                  <td>{inversor.nombre}</td>
                  <td>{inversor.nombre_estacion}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/producciones/inversor?inversor=${inversor.id}`}
                        className="btn btn-primary text-light rounded-3"
                      >
                        Ver Producción
                      </Link>
                      <Link
                        to={`/estadisticas/metricas-inversor?inversor=${inversor.id}`}
                        className="btn btn-secondary text-light rounded-3"
                      >
                        Ver Estadísticas
                      </Link>
                      <Link
                        to={`/percepciones-primer-grado?inversor=${inversor.id}`}
                        className="btn btn-info text-light rounded-3"
                      >
                        Ver Percepciones
                      </Link>
                      <Link
                        to={`/resumenes/resumenes-inversor?inversor=${inversor.id}`}
                        className="btn btn-warning text-light rounded-3"
                      >
                        Ver Resumen
                      </Link>
                      <Link
                        to={`/informes/informe-inversor?inversor=${inversor.id}`}
                        className="btn btn-success text-light rounded-3"
                      >
                        Generar Informe
                      </Link>
                      <button
                        onClick={handleDeleteInversor(inversor.id)}
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
    </div>
  );
}