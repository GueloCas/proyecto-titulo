import { InversoresList } from "../components/InversoresList"

export function InversoresPage() {
  return (
    <>
      <div className="container px-4 pt-2">
        <h1>Lista de inversores</h1>
        <InversoresList />
      </div>
    </>
  )
}