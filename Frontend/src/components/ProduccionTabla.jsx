import { Link } from "react-router-dom";

export function ProduccionTabla(req) {
    const produccion = req.produccion;
    const diasUnicos = req.diasUnicos;
    const horasUnicas = req.horasUnicas;

    return (
        <div>
            <table className="mt-1 table table-striped table-bordered ">
                <thead>
                    <tr>
                        <th>Hora/Día</th>
                        {diasUnicos.map(dia => (
                            <th key={dia}>{dia}</th>
                        ))}
                        <th>Gráf.</th>
                    </tr>
                </thead>
                <tbody>
                    {horasUnicas.map(hora => (
                        <tr key={hora}>
                            <td>{hora}</td>
                            {diasUnicos.map(dia => {
                                const produccionDiaHora = produccion.find(p => p.Dia === dia && p.Hora === hora);
                                return (
                                    <td key={dia}>
                                        {produccionDiaHora ? produccionDiaHora.cantidad : "-"}
                                    </td>
                                );
                            })}
                            <td style={{ backgroundColor: '#c0c0c0'}}>
                                <Link to={`/ProduccionInversor/grafico/${req.id}?hora=${hora}`} className="text-dark text-decoration-none d-flex justify-content-center">
                                    Ver 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="ms-1 bi bi-graph-up text-dark" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                                    </svg>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
