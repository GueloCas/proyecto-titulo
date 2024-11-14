import { useParams } from "react-router-dom";
import { ProduccionGrafico } from "../components/ProduccionGrafico";

export function ProduccionGraficoPage() {
    const { id } = useParams();

    return (
        <div className="container">
            <div className="page-inner">
                <ProduccionGrafico id={id} />
            </div>
        </div>
    )
}