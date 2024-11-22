import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function BarraLateral() {
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                            </svg>
                        </button>
                        <button className="btn sidenav-toggler">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                            </svg>
                        </button>
                    </div>
                    <button className="topbar-toggler more">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                        </svg>
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
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-person-fill-gear" viewBox="0 0 16 16">
                                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                                </svg></i>
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
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-file-earmark-bar-graph-fill" viewBox="0 0 16 16">
                                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1m.5 10v-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5m-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z" />
                                </svg></i>
                                <p>Agregar datos</p>
                            </Link>
                        </li>
                        <li className={`nav-item ${isActive('/inversores')} ${isActive('/estaciones')}`}>
                            <a data-bs-toggle="collapse" href="#inversores">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-grid-fill" viewBox="0 0 16 16">
                                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z" />
                                </svg></i>
                                <p>Inversores</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/inversores')} ${isShow('/estaciones')}`} id="inversores">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <a href="/estaciones">
                                            <span className="sub-item">Ver Estaciones</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/inversores">
                                            <span className="sub-item">Ver Inversores</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className={`nav-item ${isActive('/estadisticas/metricas-estacion')} ${isActive('/estadisticas/metricas-estacion/general-dia')} ${isActive('/estadisticas/metricas-estacion/hora-dia')} ${isActive('/estadisticas/metricas-estacion/general-mes')} ${isActive('/estadisticas/metricas-estacion/hora-mes')}`}>
                            <a data-bs-toggle="collapse" href="#estadisticas">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
                                    <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z" />
                                </svg></i>
                                <p>Estadísticas</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/estadisticas/metricas-estacion')} ${isShow('/estadisticas/metricas-estacion/general-dia')} ${isShow('/estadisticas/metricas-estacion/hora-dia')} ${isShow('/estadisticas/metricas-estacion/general-mes')} ${isShow('/estadisticas/metricas-estacion/hora-mes')}`} id="estadisticas">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <a href="/estadisticas/metricas-estacion">
                                            <span className="sub-item">Métricas por Estación</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className={`nav-item ${isActive('/percepciones-primer-grado')} ${isActive('/percepciones-primer-grado/dia')} ${isActive('/percepciones-primer-grado/hora')} ${isActive('/percepciones-segundo-grado')} ${isActive('/percepciones-segundo-grado/dia')} ${isActive('/percepciones-segundo-grado/dia-hora')}`}>
                            <a data-bs-toggle="collapse" href="#percepciones">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-database-fill-gear" viewBox="0 0 16 16">
                                    <path d="M8 1c-1.573 0-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4s.875 1.755 1.904 2.223C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777C13.125 5.755 14 5.007 14 4s-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1" />
                                    <path d="M2 7v-.839c.457.432 1.004.751 1.49.972C4.722 7.693 6.318 8 8 8s3.278-.307 4.51-.867c.486-.22 1.033-.54 1.49-.972V7c0 .424-.155.802-.411 1.133a4.51 4.51 0 0 0-4.815 1.843A12 12 0 0 1 8 10c-1.573 0-3.022-.289-4.096-.777C2.875 8.755 2 8.007 2 7m6.257 3.998L8 11c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13h.027a4.55 4.55 0 0 1 .23-2.002m-.002 3L8 14c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.5 4.5 0 0 1-1.3-1.905m3.631-4.538c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                                </svg></i>
                                <p>Percepciones</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/percepciones-primer-grado')} ${isShow('/percepciones-primer-grado/dia')} ${isShow('/percepciones-primer-grado/hora')} ${isShow('/percepciones-segundo-grado')} ${isShow('/percepciones-segundo-grado/dia')} ${isShow('/percepciones-segundo-grado/dia-hora')}`} id="percepciones">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <a href="/percepciones-primer-grado">
                                            <span className="sub-item">1° Grado</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/percepciones-segundo-grado">
                                            <span className="sub-item">2° Grado</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className={`nav-item ${isActive('/resumenes')}`}>
                            <Link to="/resumenes">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-clipboard2-pulse-fill" viewBox="0 0 16 16">
                                    <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5" />
                                    <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5M9.98 5.356 11.372 10h.128a.5.5 0 0 1 0 1H11a.5.5 0 0 1-.479-.356l-.94-3.135-1.092 5.096a.5.5 0 0 1-.968.039L6.383 8.85l-.936 1.873A.5.5 0 0 1 5 11h-.5a.5.5 0 0 1 0-1h.191l1.362-2.724a.5.5 0 0 1 .926.08l.94 3.135 1.092-5.096a.5.5 0 0 1 .968-.039Z" />
                                </svg></i>
                                <p>Resúmenes</p>
                            </Link>
                        </li>
                        <li className={`nav-item ${isActive('/informes')}`}>
                            <Link to="/informes">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-file-text-fill" viewBox="0 0 16 16">
                                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1" />
                                </svg></i>
                                <p>Informes</p>
                            </Link>
                        </li>
                        <li className="nav-item mt-auto">
                            <Link to="/">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 16 16">
                                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
                                    <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
                                </svg></i>
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
