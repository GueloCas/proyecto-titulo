import { Link, useLocation } from "react-router-dom";
import { Card } from "../components/Card";

const cardData = [
  {
    to: "dia",
    title: "Percepciones 1° por Día",
    description:
      "Muestra los valores de las percepciones de 1° de un inversor en todas las horas de un día específico",
    button: "Ver por Día",
  },
  {
    to: "hora",
    title: "Percepciones 1° por Hora",
    description:
      "Muestra los valores de las percepciones de 1° de un inversor en todos los días en una hora específica",
    button: "Ver por Hora",
  },
];

export function PercepcionesPrimerGradoPage() {
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
        <h1 className="mb-1 fw-bold">Percepciones Primer Grado</h1>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/editar-perfil">Perfil</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Percepciones 1°
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-md-12">
            <div className="card card-warning card-annoucement card-round">
              <div className="card-body text-center">
                <div className="card-opening">
                  ¿Qué son las Percepciones de Primer Grado?
                </div>
                <div className="card-desc">
                  Las percepciones de primer grado evalúan la producción de un
                  día y hora seleccionada para un inversor, en comparación con
                  los valores de producción en todos los días del mes en esa
                  hora. Se aplica lógica difusa para evaluar en qué porcentajes
                  la producción pertenece a los conjuntos de calidad baja, media
                  y alta.
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
