import { Link } from "react-router-dom";
import { Card } from "../components/Card";

const cardData = [
  {
    to: "mes",
    title: "Métricas Mensuales",
    description: "Muestra la producción de energía de un inversor en un mes, detallando las estadísticas por hora",
    button: "Ver por Mes",
  },
];

export function MetricasInversorPage() {
  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-1 fw-bold">Métricas de Inversor</h1>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Metricas Inversor
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
