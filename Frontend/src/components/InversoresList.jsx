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
  } , [])

  return (
    <div>
      <h1>Lista de inversores</h1>
      {inversores.map(inversor => (
        <div key={inversor.id}>
          <Link to={`/ProduccionInversor/${inversor.id}`}>{inversor.nombre}</Link>
        </div>
      ))}
    </div>
  )
}