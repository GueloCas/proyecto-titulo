import { Card } from "../components/Card";


const cardData = [
  {
    to: "descripciones-inversor",
    title: "Descripciones por Inversor",
    description: "Congrats and best wishes for success in your brand new life! I knew that you would do this!",
    button: "Ver Descripciones",
  },
  {
    to: "descripciones-estacion",
    title: "Descripciones por Estación",
    description: "Congrats and best wishes for success in your brand new life! I knew that you would do this!",
    button: "Ver Descripciones",
  },
];

export function ResumenesPage() {
  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-3 fw-bold">Descripciones Linguisticas</h1>
        <div className="row">
          {cardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
