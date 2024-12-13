import { Link, useLocation } from "react-router-dom";
import { Card } from "../components/Card";

const cardData = [
  {
    to: "mes",
    title: "Métricas Mensuales",
    description:
      "Muestra la producción de energía de un inversor en un mes, detallando las estadísticas por hora",
    button: "Ver por Mes",
  },
];

export function MetricasInversorPage() {
  const location = useLocation();

  // Obtener el parámetro 'inversor' desde la URL
  const searchParams = new URLSearchParams(location.search);
  const inversorId = searchParams.get("inversor");

  // Actualizar dinámicamente las URLs con el parámetro 'inversor'
  const updatedCardData = cardData.map((card) => ({
    ...card,
    to: inversorId ? `${card.to}?inversor=${inversorId}` : card.to,
  }));

  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-1 fw-bold">Métricas de Inversor</h1>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/editar-perfil">Perfil</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Métricas Inversor
            </li>
          </ol>
        </nav>

        <div className="row">
          {updatedCardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
