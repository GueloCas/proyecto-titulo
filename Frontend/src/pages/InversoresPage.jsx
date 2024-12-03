import { InversoresList } from "../components/InversoresList"

export function InversoresPage() {
  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-3 fw-bold">Lista de Inversores</h1>
        <InversoresList />
      </div>
    </div>
  )
}