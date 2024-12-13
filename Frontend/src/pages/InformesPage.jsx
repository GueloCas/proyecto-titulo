import { Link } from "react-router-dom";
import { Card } from "../components/Card";

const cardData = [
  {
    to: "informe-inversor",
    title: "Informes por Inversor",
    description: "Podrás decargar un informe en PDF con los datos de un inversor en un mes especifico.",
    button: "Generar por Inversor",
  },
  {
    to: "informe-estacion",
    title: "Informes por Estación",
    description: "Podrás decargar un informe en PDF con los datos de una estación y sus inversores en un mes especifico.",
    button: "Generar por Estación",
  },
];

export function InformesPage() {
  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-1 fw-bold">Generar Informes</h1>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/editar-perfil">Perfil</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Informes
            </li>
          </ol>
        </nav>

        <div className="row align-items-stretch">
          {cardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
