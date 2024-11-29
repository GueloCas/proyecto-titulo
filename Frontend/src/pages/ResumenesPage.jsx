import { Link } from "react-router-dom";
import { Card } from "../components/Card";

const cardData = [
  {
    to: "resumenes-inversor",
    title: "Resúmenes por Inversor",
    description: "Los resúmenes por inversor proporcionan información sobre el rendimiento de cada inversor en el sistema fotovoltaico.",
    button: "Ver por Inversor",
  },
  {
    to: "resumenes-estacion",
    title: "Resúmenes por Estación",
    description: "Los resúmenes por estación proporcionan información sobre el rendimiento de cada estación, junto con los inversores asociados.",
    button: "Ver por Estación",
  },
];

export function ResumenesPage() {
  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-1 fw-bold">Resúmenes Linguisticos</h1>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Resúmenes
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
