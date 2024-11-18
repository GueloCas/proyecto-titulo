import { Card } from "../components/Card";


const cardData = [
  {
    to: "general-dia",
    title: "Métricas Diarias",
    description: "Congrats and best wishes for success in your brand new life! I knew that you would do this!",
  },
  {
    to: "hora-dia",
    title: "Métricas Diarias por Hora",
    description: "Congrats and best wishes for success in your brand new life! I knew that you would do this!",
  },
  {
    to: "general-mes",
    title: "Métricas Mensuales",
    description: "Congrats and best wishes for success in your brand new life! I knew that you would do this!",
  },
  {
    to: "mensual-hora",
    title: "Métricas Mensuales por Hora",
    description: "Congrats and best wishes for success in your brand new life! I knew that you would do this!",
  },
];

export function MetricasEstacionPage() {
  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-3 fw-bold">Métricas de Estación</h1>
        <div className="row">
          {cardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
