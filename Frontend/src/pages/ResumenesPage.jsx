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
              <Link to="/editar-perfil">Perfil</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Resúmenes
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-md-12">
            <div className="card card-warning card-annoucement card-round">
              <div className="card-body text-center">
                <div className="card-opening">¿Qué son los Resúmenes Lingüisticos?</div>
                <div className="card-desc">Un resumen lingüistico sirve para describir la calidad de la producción en un mes. Indicando en que porcentajes se dividió la calidad de producción en los conjuntos de calidad baja, media y alta para inversores, y calidad mala, normal y excelente para estaciones</div>
              </div>
            </div>
          </div>
          {cardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
