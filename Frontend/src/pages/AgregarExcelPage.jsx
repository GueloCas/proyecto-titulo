import AgregarExcelForm from "../components/AgregarExcelForm"

export function AgregarExcelPage() {
    return (
        <div className="container">
            <div className="page-inner">
                <h1 className="mb-3 fw-bold">Cargar archivo Excel</h1>
                <AgregarExcelForm />
            </div>
        </div>
    )
}