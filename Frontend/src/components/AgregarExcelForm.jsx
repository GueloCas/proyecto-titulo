import React, { useState } from "react";
import { useDropzone } from "react-dropzone"; // Importa useDropzone
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AgregarExcelForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Configuración de dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
            file.type === "application/vnd.ms-excel") {
          setSelectedFile(file);
        } else {
          alert("Archivo no válido, selecciona un archivo Excel.");
        }
      }
    }
  });
  
  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/v1/upload-excel/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Respuesta del servidor:", response.data);
      navigate("/inversores");
    } catch (error) {
      console.error("Error subiendo el archivo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card" style={{ width: "50rem" }}>
        <div className="card-body text-center">
          <h5 className="card-title">Seleccionar archivo</h5>
          <div
            {...getRootProps()} // Spread de las propiedades de dropzone
            className="dropzone"
            style={{
              border: "2px dashed #ccc",
              padding: "30px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <input
              {...getInputProps()}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            {selectedFile ? (
              <p>{selectedFile.name}</p> // Muestra el nombre del archivo seleccionado
            ) : (
              <p>Arrastra y suelta un archivo o haz clic para seleccionarlo</p>
            )}
          </div>

          <button
            className="btn btn-danger mt-3"
            onClick={handleSubmit}
            disabled={!selectedFile || loading}
          >
            {loading ? "Cargando..." : "Subir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarExcelForm;
