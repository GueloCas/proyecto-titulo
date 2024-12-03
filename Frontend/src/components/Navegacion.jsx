import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth.api";
import 'bootstrap-icons/font/bootstrap-icons.css';

export function Navegacion() {
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="main-header">
            <div className="main-header-logo">
                <div className="logo-header" data-background-color="dark">
                    <a href="/" className="logo text-light fw-bold fs-1">
                        SADF
                    </a>
                    <div className="nav-toggle">
                        <button className="btn text-light toggle-sidebar">
                            <i className="bi bi-arrow-left-circle-fill" style={{fontSize: '20px'}}></i>
                        </button>
                        <button className="btn sidenav-toggler">
                            <i className="bi bi-arrow-right-circle-fill" style={{fontSize: '20px'}}></i>
                        </button>
                    </div>
                    <button className="topbar-toggler more">
                        <i className="bi bi-three-dots-vertical" style={{fontSize: '20px'}}></i>
                    </button>
                </div>
            </div>
            <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom py-0" style={{ backgroundColor: '#1E3A5F' }}>
                <div className="container-fluid" id="navbarSupportedContent">
                    <ul className="navbar-nav topbar-nav ms-md-auto align-items-end nav-me">
                        <li className="nav-item">
                            <a className="nav-link text-light border border-light border-opacity-50 rounded" href="#">Guia de Uso</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light border border-light border-opacity-50 rounded" href="#" onClick={handleLogout}>Cerrar Sesión</a>
                        </li>
                    </ul>
                </div>

            </nav>
        </div>
    );
}
