import { Link, useLocation } from "react-router-dom";
import { Card } from "../components/Card";

const cardData = [
  {
    to: "dia-hora",
    title: "Percepciones 2° por Día y Hora",
    description:
      "Muestra los valores de la percepción de 2° de la estación, junto con las percepciones de 1° de los inversores de la estación en un día y hora específicos",
    button: "Ver por Día y Hora",
  },
  {
    to: "dia",
    title: "Percepciones 2° por Día",
    description:
      "Muestra los valores de la percepción de 2° de la estación, junto con las percepciones de 1° de los inversores de la estación en todas las horas de un día específico",
    button: "Ver por Día",
  },
];

export function PercepcionesSegundoGradoPage() {
  const location = useLocation();

  // Obtener el parámetro 'estacion' desde la URL
  const searchParams = new URLSearchParams(location.search);
  const estacionId = searchParams.get("estacion");

  // Actualizar dinámicamente las URLs con el parámetro 'estacion'
  const updatedCardData = cardData.map((card) => ({
    ...card,
    to: estacionId ? `${card.to}?estacion=${estacionId}` : card.to,
  }));

  return (
    <div className="container">
      <div className="page-inner">
        <h1 className="mb-1 fw-bold">Percepciones Segundo Grado</h1>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/editar-perfil">Perfil</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Percepciones 2°
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-md-12">
            <div className="card card-warning card-annoucement card-round">
              <div className="card-body text-center">
                <div className="card-opening">
                  ¿Qué son las Percepciones de Segundo Grado?
                </div>
                <div className="card-desc">
                  Las percepciones de segundo grado se calculan a partir de las
                  percepciones de primer grado de todos los inversores de una
                  estación en un día y hora seleccionada. Se aplica lógica
                  difusa para evaluar en qué porcentajes el promedio de las
                  percepciones de primer grado pertenece a los conjuntos de
                  calidad mala, normal y excelente.
                </div>
              </div>
            </div>
          </div>
          {updatedCardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
