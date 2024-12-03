import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { BarraLateral } from "../components/BarraLateral";
import { Navegacion } from "../components/Navegacion";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  );
}

function PageRoot() {
  const navigate = useNavigate();
  const location = useLocation(); // Obtenemos la ubicación actual

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // Condicionamos para que solo se muestren en rutas distintas a "/"
  const showSidebarAndNav = location.pathname !== "/";

  return (
    <>
      {/* Render only the main-panel wrapper if not on "/" */}
      {showSidebarAndNav && (
        <>
          <BarraLateral />
          <div className="main-panel">
            <Navegacion />
            <Outlet />
          </div>
        </>
      )}

      {/* If you're on "/" route, just show the Outlet */}
      {location.pathname === "/" && <Outlet />}
    </>
  );
}


export default Root;


