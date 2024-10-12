import React, { useState } from "react";
import axios from "axios"; // Asegúrate de instalar axios
import { useNavigate } from "react-router-dom";

const AgregarExcelForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
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
    }
  };

  return (
    <div>
      <h3>Cargar archivo Excel</h3>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button onClick={handleSubmit}>Subir</button>
    </div>
  );
};

export default AgregarExcelForm;
