import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { set } from "react-hook-form";
import Swal from "sweetalert2";

const AgregarExcelForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Configuración de dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel" ||
          file.type === "text/csv") {
          setSelectedFile(file);
        } else {
          alert("Archivo no válido, selecciona un archivo Excel o CSV.");
        }
      }
    }
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    if (user) {
      formData.append("user", JSON.stringify(user)); // Convierte `user` en una cadena JSON
    }

    setLoading(true);

    try {
      const fileType = selectedFile.type;
      let uploadUrl = "";
    
      if (
        fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        fileType === "application/vnd.ms-excel"
      ) {
        uploadUrl = "http://localhost:8000/api/v1/upload-excel/";
      } else if (fileType === "text/csv") {
        uploadUrl = "http://localhost:8000/api/v1/upload-csv/";
      } else {
        Swal.fire({
          icon: "error",
          title: "Formato inválido",
          text: "Selecciona un archivo Excel o CSV.",
        });
        setLoading(false);
        return;
      }
    
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSelectedFile(null);
    
      const responseData = response.data.data;
    
      // Preparar información para cada sección
      const nuevosInversores = responseData.nuevos_inversores.map((inv) => `<li>${inv}</li>`).join("") || "<p>Ninguno</p>";
    
      const nuevasProducciones = responseData.nuevas_producciones
        .map(
          (prod) =>
            `<li><b>${prod.inversor}</b>, ${prod.fecha}, ${prod.hora}, Cantidad: ${prod.cantidad}</li>`
        )
        .join("") || "<p>Ninguna</p>";
    
      const produccionesActualizadas = responseData.producciones_actualizadas
        .map(
          (prod) => `<li><b>${prod.inversor}</b>, ${prod.fecha}, ${prod.hora}, Cantidad: ${prod.cantidad}</li>`
        )
        .join("") || "<p>Ninguna</p>";
    
      // Incluir la información de la estación nueva
      const estacion = responseData.nueva_estacion;
      const nuevaEstacion = `<p><b>${estacion.nombre}</b> - ${estacion.mensaje}</p>`;
    
      // Crear acordeón HTML
      const resumen = `
        <div style="text-align: left;">
          <details>
            <summary style="font-weight: bold; cursor: pointer;">Estación</summary>
            <div>${nuevaEstacion}</div>
          </details>
          <details>
            <summary style="font-weight: bold; cursor: pointer;">Inversores Nuevos</summary>
            <ul>${nuevosInversores}</ul>
          </details>
          <details>
            <summary style="font-weight: bold; cursor: pointer;">Producciones Nuevas</summary>
            <ul>${nuevasProducciones}</ul>
          </details>
          <details>
            <summary style="font-weight: bold; cursor: pointer;">Producciones Actualizadas</summary>
            <ul>${produccionesActualizadas}</ul>
          </details>
        </div>
      `;
    
      // Mostrar SweetAlert2 con el acordeón
      Swal.fire({
        title: "Resumen del procesamiento",
        html: resumen,
        icon: "success",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Ir a Inversores",
        cancelButtonText: "Cerrar",
        customClass: {
          popup: "swal-wide",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/inversores");
        }
      });
    } catch (error) {
      console.error("Error subiendo el archivo:", error);
      Swal.fire({
        icon: "error",
        title: "Error al subir el archivo",
        text: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
      });
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
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
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
