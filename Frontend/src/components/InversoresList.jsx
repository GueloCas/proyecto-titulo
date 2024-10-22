import { useEffect, useState } from "react";
import { getInversores } from "../api/inversores.api";
import { Link } from "react-router-dom";

export function InversoresList() {
  const [inversores, setInversores] = useState([]);
  const [inversorSeleccionado, setInversorSeleccionado] = useState(null);

  useEffect(() => {
    async function loadInversores() {
      const data = await getInversores();
      setInversores(data);
    }
    loadInversores();
  }, []);

  const handleInversorSeleccionado = (inversor) => {
    setInversorSeleccionado(inversor);
    setInversores([]); // Limpiar la lista de inversores
  };

  const handleSeleccionarOtroInversor = () => {
    setInversorSeleccionado(null); // Restablecer el inversor seleccionado
    loadInversores(); // Volver a cargar la lista de inversores
  };

  return (
    <div className="d-grid gap-2 d-md-block">
      {inversorSeleccionado ? ( // Si hay un inversor seleccionado
        <div>
          <h4>Inversor Seleccionado: {inversorSeleccionado.nombre}</h4>
          <div className="d-flex mb-2">
            <button
              className="btn btn-warning me-2"
              onClick={handleSeleccionarOtroInversor} // Lógica para seleccionar otro inversor
            >
              Seleccionar Otro
            </button>
            <Link to={`/ProduccionInversor/${inversorSeleccionado.id}`} className="btn btn-primary me-2">
              Ver Producción
            </Link>
            <Link to={`/ProduccionInversor/Estadisticas/${inversorSeleccionado.id}?inversor=${inversorSeleccionado.nombre}`} className="btn btn-secondary me-2">
              Ver Estadísticas
            </Link>
            <Link to={`/ProduccionInversor/Grados/${inversorSeleccionado.id}?inversor=${inversorSeleccionado.nombre}`} className="btn btn-success me-2">
              Ver Grados
            </Link>
          </div>
        </div>
      ) : (
        inversores.length === 0 ? (
          <p>No existen inversores</p>
        ) : (
          inversores.map(inversor => (
            <button
              className="btn me-2"
              type="button"
              key={inversor.id}
              style={{ backgroundColor: '#a81a1a', color: 'white' }}
              onClick={() => handleInversorSeleccionado(inversor)} // Manejar la selección del inversor
            >
              {inversor.nombre}
            </button>
          ))
        )
      )}
    </div>
  );
}
