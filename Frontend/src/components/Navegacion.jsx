export function Navegacion() {
    return (
        <nav className="navbar navbar-expand-lg py-3" style={{ backgroundColor: '#1E3A5F' }}>
            <div className="container-fluid justify-content-center w-auto">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                        <li className="nav-item"> 
                            <a className="nav-link text-light border border-light border-opacity-50 rounded" href="/agregar-excel">Cargar Excel</a>
                        </li>
                        <li className="nav-item ps-2">
                            <a className="nav-link text-light border border-light border-opacity-50 rounded" aria-current="page" href="/Inversores">Inversores</a>
                        </li>
                        <li className="nav-item ps-2">
                            <a className="nav-link text-light border border-light border-opacity-50 rounded" aria-current="page" href="/PercepcionesComputacionales">Percepciones</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}