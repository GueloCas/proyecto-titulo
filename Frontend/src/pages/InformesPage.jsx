import { Link } from "react-router-dom";
import { Card } from "../components/Card";

const cardData = [
  {
    to: "informe-inversor",
    title: "Informes por Inversor",
    description: "Congrats and best wishes for success in your brand new life! I knew that you would do this!",
    button: "Generar por Inversor",
  },
  {
    to: "informe-estacion",
    title: "Informes por Estación",
    description: "Congrats and best wishes for success in your brand new life! I knew that you would do this!",
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
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Informes
            </li>
          </ol>
        </nav>

        <div className="row">
          {cardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
