import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  return (
    <>
      <div className="hero_area">
        <div className="bg-box">
          <img src="assets/img/fondo-inicio.jpg" />
        </div>
        <header className="header_area">
          <div className="container">
            <nav className="navbar navbar-expand-lg py-4 d-flex justify-content-between">
              <p className="navbar-brand text-light fw-bold fs-1" href="/">HADF</p>
              <div>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link to="/" className="nav-link text-light fw-bold fs-5">Inicio</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="#" className="nav-link text-light fw-bold fs-5">Guia de Uso</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="#" className="nav-link text-light fw-bold fs-5">Contacto</Link>
                    </li>
                  </ul>
                </div>
              </div>
              {user ? (
              <Link to="/inversores" className="btn btn-warning btn-lg d-flex align-items-center rounded-5 fw-bold px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-fill me-2 " viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
                {user.username}
              </Link>
              ) : (  
              <Link to="/login" className="btn btn-warning btn-lg d-flex align-items-center rounded-5 fw-bold px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-fill me-2 " viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
                Iniciar Sesión
              </Link>
              )}
            </nav>
          </div>
        </header>
        <section className="title_section">
          <div className="container">
            <div className="row">
              <h2 className="fw-bold fs-1 mb-4">¿Lorem ipsum?</h2>
              <p className="fs-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </div>
        </section>
      </div>
      <div className="container">
        <h1 className="text-left my-5">Sobre el Proyecto</h1>
      </div>
    </>
  );
}

export default App;