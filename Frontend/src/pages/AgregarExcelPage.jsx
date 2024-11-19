import AgregarExcelForm from "../components/AgregarExcelForm";
import GuíaSubirArchivo from "../components/GuiaSubirArchivo";



export function AgregarExcelPage() {
    return (
        <div className="container">
            <div className="page-inner d-flex justify-content-between align-items-center">
                <h1 className="mb-3 mt-2 fw-bold">Cargar archivo</h1>
                <div>
                    <GuíaSubirArchivo />
                </div>
            </div>
            <AgregarExcelForm />
        </div>
    );
}
