import { Link } from "react-router-dom";
import { Card } from "../components/Card";

const cardData = [
    {
        to: "dia-hora",
        title: "Percepciones 2° por Día y Hora",
        description: "Muestra los valores de la percepcción de 2° de la estación, junto con las percepciones de 1° de los inversores de la estación en un día y hora específicos",
        button: "Ver por Día y Hora"
    },
    {
        to: "dia",
        title: "Percepciones 2° por Día",
        description: "Muestra los valores de la percepcción de 2° de la estación, junto con las percepciones de 1° de los inversores de la estación en todas las horas de un día específico",
        button: "Ver por Día"
    }
];

export function PercepcionesSegundoGradoPage() {
    return (
        <div className="container">
            <div className="page-inner">
                <h1 className="mb-1 fw-bold">Percepciones Segundo Grado</h1>

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Percepciones 2°
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