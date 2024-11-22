import { Link } from "react-router-dom";
import { Card } from "../components/Card";

const cardData = [
    {
        to: "dia",
        title: "Percepciones 1° por Día",
        description: "Muestra los valores de la percepcciones de 1° de un inversor en todas las horas de un día específico",
        button: "Ver por Día",
    },
    {
        to: "hora",
        title: "Percepciones 1° por Hora",
        description: "Muestra los valores de la percepcciones de 1° de un inversor en todos los días en una hora específica",
        button: "Ver por Hora",
    }
];

export function PercepcionesPrimerGradoPage() {
    return (
        <div className="container">
            <div className="page-inner">
                <h1 className="mb-1 fw-bold">Percepciones Primer Grado</h1>

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Percepciones 1°
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