import { useEffect, useState } from "react";
import { deleteEstacion, getEstaciones } from "../api/estacion.api";
import { Link } from "react-router-dom";

export function EstacionesList() {
  const [estaciones, setEstaciones] = useState([]);

  useEffect(() => {
    async function loadEstaciones() {
      const data = await getEstaciones();
      setEstaciones(data);
    }
    loadEstaciones();
  }, []);

  const handleDeleteEstacion = (id) => {
    return async () => {
      await deleteEstacion(id);
      const data = await getEstaciones();
      setEstaciones(data);
    };
  };

  return (
    <div className="row g-4">
      {estaciones.length === 0 ? (
        <p>No existen estaciones</p>
      ) : (
        estaciones.map((estacion) => (
          <div key={estacion.id} className="col-md-3">
            <div className="card rounded-3 border-0 mb-0">
              <div className="card-body">
                <h5 className="card-title">{estacion.nombre}</h5>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <Link
                    to={`/inversores?buscar=${estacion.nombre}`}
                    className="btn btn-primary text-light rounded-3"
                  >
                    Ver Inversores
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
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
