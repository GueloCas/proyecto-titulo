import { EstacionesList } from "../components/EstacionesList"

export function EstacionesPage() {
  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-3 fw-bold">Lista de Estaciones</h1>
        <EstacionesList />
      </div>
    </div>
  )
}