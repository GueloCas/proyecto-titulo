import { useEffect, useState } from "react"
import { getInversores } from "../api/inversores.api"
import { Link } from "react-router-dom"

export function InversoresList() {
  const [inversores, setInversores] = useState([]);

  useEffect(() => {
    async function loadInversores() {
      const data = await getInversores();
      setInversores(data);
      console.log(data);
    }
    loadInversores();
  }, [])

  return (
    <div className="d-grid gap-2 d-md-block">
      {inversores.length === 0 ? (  // Verifica si no hay inversores
        <p>No existen inversores</p>  // Muestra el mensaje si el arreglo está vacío
      ) : (
        inversores.map(inversor => (
          <button className="btn me-2" type="button" key={inversor.id} style={{ backgroundColor: '#a81a1a' }}>
            <Link to={`/ProduccionInversor/${inversor.id}`} className="text-white text-decoration-none">
              {inversor.nombre}
            </Link>
          </button>
        ))
      )}
    </div>
);

}
