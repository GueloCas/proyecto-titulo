import { useParams } from "react-router-dom";
import { ProduccionGrafico } from "../components/ProduccionGrafico";

export function ProduccionGraficoPage() {
    const { id } = useParams();

    return (
        <div className="container-fluid px-4 pt-2">
            <ProduccionGrafico id={id} />
        </div>
    )
}