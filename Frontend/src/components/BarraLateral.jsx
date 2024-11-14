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
                        <li className={`nav-item ${isActive('/agregar-excel')}`}>
                            <a data-bs-toggle="collapse" href="#tables">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-file-earmark-bar-graph-fill" viewBox="0 0 16 16">
                                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1m.5 10v-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5m-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z" />
                                </svg></i>
                                <p>Cargar Datos</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/agregar-excel')}`} id="tables">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <a href="agregar-excel">
                                            <span className="sub-item">Cargar Excel</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="tables/datatables.html">
                                            <span className="sub-item">Cargar Csv</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="tables/datatables.html">
                                            <span className="sub-item">Cargar Tabla</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className={`nav-item ${isActive('/inversores')}`}>
                            <a data-bs-toggle="collapse" href="#inversores">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-grid-fill" viewBox="0 0 16 16">
                                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z" />
                                </svg></i>
                                <p>Inversores</p>
                                <span className="caret"></span>
                            </a>
                            <div className={`collapse ${isShow('/inversores')}`} id="inversores">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <a href="charts/charts.html">
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
                        <li className="nav-item">
                            <a data-bs-toggle="collapse" href="#monitoreo">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-display" viewBox="0 0 16 16">
                                    <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145" />
                                </svg></i>
                                <p>Monitoreo</p>
                                <span className="caret"></span>
                            </a>
                            <div className="collapse" id="monitoreo">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <a href="charts/charts.html">
                                            <span className="sub-item">Grafico por Hora</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item">
                            <a data-bs-toggle="collapse" href="#percepciones">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
                                    <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z" />
                                </svg></i>
                                <p>Percepciones</p>
                                <span className="caret"></span>
                            </a>
                            <div className="collapse" id="percepciones">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <a href="charts/charts.html">
                                            <span className="sub-item">1° Grado</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/PercepcionesComputacionales">
                                            <span className="sub-item">2° Grado</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item mt-auto">
                            <Link to="/">
                                <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
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
