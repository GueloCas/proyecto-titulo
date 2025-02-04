import { Link, useLocation } from "react-router-dom";
import { Card } from "../components/Card";

const cardData = [
  {
    to: "general-dia",
    title: "Métricas Diarias",
    description: "Muestra la producción de energía de la estación en un día específico, junto con la cantidad producida por cada uno de sus inversores",
    button: "Ver por Día",
  },
  {
    to: "hora-dia",
    title: "Métricas Diarias por Hora",
    description: "Muestra la producción de energía de la estación en un día y hora específicos, junto con la cantidad producida por cada uno de sus inversores",
    button: "Ver por Día y Hora",
  },
  {
    to: "general-mes",
    title: "Métricas Mensuales",
    description: "Muestra la producción de energía de la estación en un mes específico, junto con la cantidad producida por cada uno de sus inversores",
    button: "Ver por Mes",
  },
  {
    to: "hora-mes",
    title: "Métricas Mensuales por Hora",
    description: "Muestra la producción de energía de la estación en un mes y hora específicos, junto con la cantidad producida por cada uno de sus inversores",
    button: "Ver por Mes y Hora",
  },
];

export function MetricasEstacionPage() {
  const location = useLocation();

  // Función para obtener el valor del parámetro 'estacion' de la URL
  const searchParams = new URLSearchParams(location.search);
  const estacionId = searchParams.get("estacion");

  // Actualizamos las URLs si 'estacion' existe
  const updatedCardData = cardData.map((card) => ({
    ...card,
    to: estacionId ? `${card.to}?estacion=${estacionId}` : card.to,
  }));

  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-1 fw-bold">Métricas de Estación</h1>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/editar-perfil">Perfil</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Métricas Estación
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
