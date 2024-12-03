import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export function BarraLateral() {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 992);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "/assets/kaiadmin.js"; // Ruta relativa a public
        document.body.appendChild(script);

        // Limpia el script al desmontar el componente
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const isActive = (path) => location.pathname === path ? 'active' : '';
    const isShow = (path) => location.pathname === path ? 'show' : '';

    return (
        /* <!-- Sidebar --> */
        <div className="sidebar" data-background-color="dark">
            <div className="sidebar-logo">
                {/* <!-- Logo Header --> */}
                <div className="logo-header" data-background-color="dark">
                    <a href="/" className="logo text-light fw-bold fs-1">
                        SADF
                    </a>
                    <div className="nav-toggle">
                        <button className="btn text-light toggle-sidebar">
                            <i
                                className={isSmallScreen ? "bi bi-list" : "bi bi-arrow-left-circle-fill"}
                                style={{ fontSize: '20px' }}
                            ></i>
                        </button>
                        <button className="btn text-light sidenav-toggler">
                            <i
                                className={isSmallScreen ? "bi bi-list" : "bi bi-arrow-right-circle-fill"}
                                style={{ fontSize: '20px' }}
                            ></i>
                        </button>
                    </div>
                    <button className="topbar-toggler more">
                        <i
                            className={isSmallScreen ? "bi bi-three-dots-vertical" : "bi bi-arrow-right-circle-fill"}
                            style={{ fontSize: '20px' }}
                        ></i>
                    </button>
                </div>
                {/* <!-- End Logo Header --> */}
            </div>
            <div className="sidebar-wrapper scrollbar scrollbar-inner">
                <div className="sidebar-content">
                    <ul className="nav nav-secondary">
                        <li className={`nav-item ${isActive('/editar-perfil')}`}>
                            <a
                                data-bs-toggle="collapse"
                                href="#perfil"
                                className="collapsed"
                                aria-expanded="false"
                            >
                                <i className="bi bi-person-fill-gear"></i>
                                <p>Perfil</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/editar-perfil')}`} id="perfil">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <a href="/editar-perfil">
                                            <span className="sub-item">Editar Perfil</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-section">
                            <span className="sidebar-mini-icon">
                                <i className="fa fa-ellipsis-h"></i>
                            </span>
                            <h4 className="text-section">DATOS</h4>
                        </li>
                        <li className={`nav-item ${isActive('/agregar-datos')}`}>
                            <Link to="/agregar-datos">
                                <i className="bi bi-file-earmark-bar-graph-fill"></i>
                                <p>Agregar datos</p>
                            </Link>
                        </li>
                        <li className={`nav-item ${isActive('/inversores')} ${isActive('/estaciones')}`}>
                            <a data-bs-toggle="collapse" href="#inversores">
                                <i className="bi bi-grid-fill"></i>
                                <p>Inversores</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/inversores')} ${isShow('/estaciones')}`} id="inversores">
                                <ul className="nav nav-collapse">
                                    <li className={`${isActive('/estaciones')}`}>
                                        <a href="/estaciones">
                                            <span className="sub-item">Ver Estaciones</span>
                                        </a>
                                    </li>
                                    <li className={`${isActive('/inversores')}`}>
                                        <a href="/inversores">
                                            <span className="sub-item">Ver Inversores</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className={`nav-item ${isActive('/producciones/inversor')}`}>
                            <a data-bs-toggle="collapse" href="#producciones">
                                <i className="bi bi-gear-fill"></i>
                                <p>Producciones</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/producciones/inversor')}`} id="producciones">
                                <ul className="nav nav-collapse">
                                    <li className={`${isActive('/producciones/inversor')}`}>
                                        <a href="/producciones/inversor">
                                            <span className="sub-item">Inversor</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className={`nav-item ${isActive('/estadisticas/metricas-estacion')} ${isActive('/estadisticas/metricas-estacion/general-dia')} ${isActive('/estadisticas/metricas-estacion/hora-dia')} ${isActive('/estadisticas/metricas-estacion/general-mes')} ${isActive('/estadisticas/metricas-estacion/hora-mes')}`}>
                            <a data-bs-toggle="collapse" href="#estadisticas">
                                <i className="bi bi-bar-chart-line-fill"></i>
                                <p>Estadísticas</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/estadisticas/metricas-estacion')} ${isShow('/estadisticas/metricas-estacion/general-dia')} ${isShow('/estadisticas/metricas-estacion/hora-dia')} ${isShow('/estadisticas/metricas-estacion/general-mes')} ${isShow('/estadisticas/metricas-estacion/hora-mes')}`} id="estadisticas">
                                <ul className="nav nav-collapse">
                                    <li className={`${isActive('/estadisticas/metricas-estacion')} ${isActive('/estadisticas/metricas-estacion/general-dia')} ${isActive('/estadisticas/metricas-estacion/hora-dia')} ${isActive('/estadisticas/metricas-estacion/general-mes')} ${isActive('/estadisticas/metricas-estacion/hora-mes')}`}>
                                        <a href="/estadisticas/metricas-estacion">
                                            <span className="sub-item">Métricas por Estación</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className={`nav-item ${isActive('/percepciones-primer-grado')} ${isActive('/percepciones-primer-grado/dia')} ${isActive('/percepciones-primer-grado/hora')} ${isActive('/percepciones-segundo-grado')} ${isActive('/percepciones-segundo-grado/dia')} ${isActive('/percepciones-segundo-grado/dia-hora')}`}>
                            <a data-bs-toggle="collapse" href="#percepciones">
                                <i className="bi bi-database-fill-gear"></i>
                                <p>Percepciones</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/percepciones-primer-grado')} ${isShow('/percepciones-primer-grado/dia')} ${isShow('/percepciones-primer-grado/hora')} ${isShow('/percepciones-segundo-grado')} ${isShow('/percepciones-segundo-grado/dia')} ${isShow('/percepciones-segundo-grado/dia-hora')}`} id="percepciones">
                                <ul className="nav nav-collapse">
                                    <li className={`${isActive('/percepciones-primer-grado')} ${isActive('/percepciones-primer-grado/dia')} ${isActive('/percepciones-primer-grado/hora')}`}>
                                        <a href="/percepciones-primer-grado">
                                            <span className="sub-item">1° Grado</span>
                                        </a>
                                    </li>
                                    <li className={`${isActive('/percepciones-segundo-grado')} ${isActive('/percepciones-segundo-grado/dia')} ${isActive('/percepciones-segundo-grado/dia-hora')}`}>
                                        <a href="/percepciones-segundo-grado">
                                            <span className="sub-item">2° Grado</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className={`nav-item ${isActive('/resumenes')} ${isActive('/resumenes/resumenes-inversor')} ${isActive('/resumenes/resumenes-estacion')}`}>
                            <Link to="/resumenes">
                                <i className="bi bi-clipboard2-pulse-fill"></i>
                                <p>Resúmenes</p>
                            </Link>
                        </li>
                        <li className={`nav-item ${isActive('/informes')} ${isActive('/informes/informe-inversor')} ${isActive('/informes/informe-estacion')}`}>
                            <Link to="/informes">
                                <i className="bi bi-file-text-fill"></i>
                                <p>Informes</p>
                            </Link>
                        </li>
                        <li className="nav-item mt-auto">
                            <Link to="/">
                                <i className="bi bi-house-fill"></i>
                                <p>Ir a Inicio</p>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default BarraLateral;
