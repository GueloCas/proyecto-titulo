import React, { useState } from "react";
import axios from "axios"; // Asegúrate de instalar axios
import { useNavigate } from "react-router-dom";

const AgregarExcelForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    setSelectedFile(e.target.files[0]); // Almacena el archivo seleccionado
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // Envia el archivo como parte del form

    setLoading(true); // Muestra el mensaje de cargando

    try {
      const response = await axios.post("http://localhost:8000/api/v1/upload-excel/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Respuesta del servidor:", response.data);
      navigate("/Inversores");
    } catch (error) {
      console.error("Error subiendo el archivo:", error);
    } finally {
      setLoading(false); // Restablece el estado de loading después de recibir la respuesta
    }
  };

  return (
    <div className="container mt-2">
      <h3 className="pt-3">Cargar archivo Excel</h3>
      {!loading && ( // Muestra el input solo si no está cargando
        <div className="input-group mb-3">
          <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileUpload} />
          <button className="btn text-light" onClick={handleSubmit} style={{ backgroundColor: '#a81a1a' }}>Subir Archivo</button>
        </div>
      )}
      {loading &&
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>} {/* Muestra el mensaje de carga si loading es true */}
    </div>
  );
};

export default AgregarExcelForm;


