import { useParams } from "react-router-dom";
import { ProduccionTabla } from "../components/ProduccionTabla";

export function ProduccionInversorPage() {
    const { id } = useParams();

    return (
        <div className="container-fluid px-4 pt-2">
            <ProduccionTabla id={id} />
        </div>
    )
}