import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export function BarraLateral() {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);
    const [activeMenu, setActiveMenu] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "/assets/kaiadmin.js"; // Ruta relativa a public
        document.body.appendChild(script);

        return () => document.body.removeChild(script);
    }, []);

    const toggleSubMenu = (menu) => {
        setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';
    const isShow = (menu) => activeMenu === menu || location.pathname.includes(menu) ? 'show' : '';
    const isSubMenu = (menu) => activeMenu === menu || location.pathname.includes(menu) ? 'submenu' : '';

    return (
        /* Sidebar */
        <div className="sidebar" data-background-color="dark">
            <div className="sidebar-logo">
                {/* Logo Header */}
                <div className="logo-header" data-background-color="dark">
                    <a href="/" className="logo text-light fw-bold fs-1">SADF</a>
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
                    <button className="btn text-light topbar-toggler more">
                        <i className="bi bi-three-dots-vertical" style={{ fontSize: '20px' }}></i>
                    </button>
                </div>
            </div>
            <div className="sidebar-wrapper scrollbar scrollbar-inner">
                <div className="sidebar-content">
                    <ul className="nav nav-secondary">

                        {/* Perfil */}
                        <li className={`nav-item ${isActive('/editar-perfil')} ${isSubMenu('perfil')}`}>
                            <a
                                href="#perfil"
                                onClick={() => toggleSubMenu('perfil')}
                                aria-expanded={activeMenu === 'perfil'}
                            >
                                <i className="bi bi-person-fill-gear"></i>
                                <p>Perfil</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/editar-perfil')} ${isShow('perfil')}`} id="perfil">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <Link to="/editar-perfil">
                                            <span className="sub-item">Editar Perfil</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        {/* Datos */}
                        <li className="nav-section">
                            <h4 className="text-section">DATOS</h4>
                        </li>
                        <li className={`nav-item ${isActive('/agregar-datos')}`}>
                            <Link to="/agregar-datos">
                                <i className="bi bi-file-earmark-bar-graph-fill"></i>
                                <p>Agregar datos</p>
                            </Link>
                        </li>

                        {/* Inversores */}
                        <li className={`nav-item ${isActive('/inversores')} ${isActive('/estaciones')} ${isSubMenu('inversores')}`}>
                            <a
                                href="#inversores"
                                onClick={() => toggleSubMenu('inversores')}
                                aria-expanded={activeMenu === 'inversores'}
                            >
                                <i className="bi bi-grid-fill"></i>
                                <p>Inversores</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/inversores')} ${isShow('/estaciones')} ${isShow('inversores')}`} id="inversores">
                                <ul className="nav nav-collapse">
                                    <li className={`${isActive('/estaciones')}`}>
                                        <Link to="/estaciones">
                                            <span className="sub-item">Ver Estaciones</span>
                                        </Link>
                                    </li>
                                    <li className={`${isActive('/inversores')}`}>
                                        <Link to="/inversores">
                                            <span className="sub-item">Ver Inversores</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        {/* Producciones */}
                        <li className={`nav-item ${isActive('/producciones/inversor')} ${isSubMenu('producciones')}`}>
                            <a
                                href="#producciones"
                                onClick={() => toggleSubMenu('producciones')}
                                aria-expanded={activeMenu === 'producciones'}
                            >
                                <i className="bi bi-gear-fill"></i>
                                <p>Producciones</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/producciones/inversor')} ${isShow('producciones')}`} id="producciones">
                                <ul className="nav nav-collapse">
                                    <li className={`${isActive('/producciones/inversor')}`}>
                                        <Link to="/producciones/inversor">
                                            <span className="sub-item">Inversor</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        {/* Estadísticas */}
                        <li className={`nav-item ${isActive('/estadisticas/metricas-estacion')} ${isActive('/estadisticas/metricas-estacion/general-dia')} ${isActive('/estadisticas/metricas-estacion/hora-dia')} ${isActive('/estadisticas/metricas-estacion/general-mes')} ${isActive('/estadisticas/metricas-estacion/hora-mes')} ${isActive('/estadisticas/metricas-inversor')} ${isActive('/estadisticas/metricas-inversor/mes')} ${isSubMenu('estadisticas')}`}>
                            <a
                                href="#estadisticas"
                                onClick={() => toggleSubMenu('estadisticas')}
                                aria-expanded={activeMenu === 'estadisticas'}
                            >
                                <i className="bi bi-bar-chart-line-fill"></i>
                                <p>Estadísticas</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/estadisticas/metricas-estacion')} ${isShow('/estadisticas/metricas-estacion/general-dia')} ${isShow('/estadisticas/metricas-estacion/hora-dia')} ${isShow('/estadisticas/metricas-estacion/general-mes')} ${isShow('/estadisticas/metricas-estacion/hora-mes')}  ${isShow('/estadisticas/metricas-inversor')} ${isShow('/estadisticas/metricas-inversor/mes')} ${isShow('estadisticas')}`} id="estadisticas">
                                <ul className="nav nav-collapse">
                                    <li className={`${isActive('/estadisticas/metricas-estacion')} ${isActive('/estadisticas/metricas-estacion/general-dia')} ${isActive('/estadisticas/metricas-estacion/hora-dia')} ${isActive('/estadisticas/metricas-estacion/general-mes')} ${isActive('/estadisticas/metricas-estacion/hora-mes')}`}>
                                        <a href="/estadisticas/metricas-estacion">
                                            <span className="sub-item">Métricas por Estación</span>
                                        </a>
                                    </li>
                                    <li className={`${isActive('/estadisticas/metricas-inversor')} ${isActive('/estadisticas/metricas-inversor/mes')}`}>
                                        <a href="/estadisticas/metricas-inversor">
                                            <span className="sub-item">Métricas por Inversor</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        {/* Percepciones */}
                        <li className={`nav-item ${isActive('/percepciones-primer-grado')} ${isActive('/percepciones-primer-grado/dia')} ${isActive('/percepciones-primer-grado/hora')} ${isActive('/percepciones-segundo-grado')} ${isActive('/percepciones-segundo-grado/dia')} ${isActive('/percepciones-segundo-grado/dia-hora')} ${isSubMenu('percepciones')}`}>
                            <a
                                href="#percepciones"
                                onClick={() => toggleSubMenu('percepciones')}
                                aria-expanded={activeMenu === 'percepciones'}
                            >
                                <i className="bi bi-database-fill-gear"></i>
                                <p>Percepciones</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/percepciones-primer-grado')} ${isShow('/percepciones-primer-grado/dia')} ${isShow('/percepciones-primer-grado/hora')} ${isShow('/percepciones-segundo-grado')} ${isShow('/percepciones-segundo-grado/dia')} ${isShow('/percepciones-segundo-grado/dia-hora')} ${isShow('percepciones')}`} id="percepciones">
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

                        {/* Resúmenes */}
                        <li className={`nav-item ${isActive('/resumenes')} ${isActive('/resumenes/resumenes-inversor')} ${isActive('/resumenes/resumenes-estacion')} ${isActive('/resumenes')}`}>
                            <Link to="/resumenes">
                                <i className="bi bi-clipboard2-pulse-fill"></i>
                                <p>Resúmenes</p>
                            </Link>
                        </li>

                        {/* Informes */}
                        <li className={`nav-item ${isActive('/informes')} ${isActive('/informes/informe-inversor')} ${isActive('/informes/informe-estacion')}`}>
                            <Link to="/informes">
                                <i className="bi bi-file-text-fill"></i>
                                <p>Informes</p>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default BarraLateral;

