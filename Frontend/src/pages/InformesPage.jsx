import { Card } from "../components/Card";


const cardData = [
  {
    to: "informes-inversor",
    title: "Informes por Inversor",
    description: "Congrats and best wishes for success in your brand new life! I knew that you would do this!",
    button: "Ver Informes",
  },
  {
    to: "informes-estacion",
    title: "Informes por Estación",
    description: "Congrats and best wishes for success in your brand new life! I knew that you would do this!",
    button: "Ver Informes",
  },
];

export function InformesPage() {
  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-3 fw-bold">Generar Informes</h1>
        <div className="row">
          {cardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
