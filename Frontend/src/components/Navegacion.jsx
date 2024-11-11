import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth.api";

export function Navegacion() {
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="main-header">
            <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom" style={{ backgroundColor: '#1E3A5F' }}>
                <div className="container-fluid" id="navbarSupportedContent">
                    <ul className="navbar-nav topbar-nav ms-md-auto align-items-end me-4">
                        <li className="nav-item">
                            <a className="nav-link text-light border border-light border-opacity-50 rounded" href="#">Guia de Uso</a>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link text-light border border-light border-opacity-50 rounded" onClick={handleLogout}>Cerrar Sesión</button>
                        </li>
                    </ul>
                </div>

            </nav>
        </div>
    );
}
