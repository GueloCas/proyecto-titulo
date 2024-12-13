import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Usar navigate para redirigir

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirigir a /login si no hay usuario
    } else {
      navigate("/inversores"); // Redirigir a /inversores si hay usuario
    }
  }, [user, navigate]);

  return null; // No se renderiza ningún contenido
}

export default App;
