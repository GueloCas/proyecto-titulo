import { useParams } from "react-router-dom";
import { ProduccionTabla } from "../components/ProduccionTabla";

export function ProduccionInversorPage() {
    const { id } = useParams();

    return (
        <ProduccionTabla id={id} />
    )
}