import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const GuiaSubirArchivo = () => {

  const pages = [
    {
      title: 'Formato de los datos para archivos Excel',
      imageUrl: '../Formato Excel DATOS.png',
      text: 'Para subir los datos de las estaciones a la plataforma, es necesario que el archivo Excel tenga el formato mostrado en la imagen. Asegúrate de que los datos estén en el orden correcto y que no haya celdas vacías.',
      buttonText: 'Siguiente'
    },
    {
      title: 'Formato de los nombres de las estaciones',
      imageUrl: '../Formato excel Nombre de estaciones.png',
      text: 'El nombre de la hoja de Excel será el nombre de la estación.',
      buttonText: 'Siguiente'
    },
    {
      title: 'Formato de los datos para archivos CSV',
      imageUrl: '../Formato CSV DATOS.png',
      text: 'Para subir los datos de las estaciones a la plataforma, es necesario que el archivo CSV tenga el formato mostrado en la imagen. Asegúrate de que los datos estén en el orden correcto y que no haya celdas vacías.',
      buttonText: 'Siguiente'
    },
    {
      title: 'Formato del nombre de la estación para archivos CSV',
      imageUrl: '../Formato CSV nombre de estacion.png',
      text: 'El nombre del archivo CSV será el nombre de estación.',
      buttonText: 'Finalizar'
    }
  ];

  const handleShowModal = () => {
    showModal(0); // Llama a showModal con la página inicial
  };

  const showModal = (pageIndex) => {
    MySwal.fire({
      html: (
        <div>
          <h2>{pages[pageIndex].title}</h2>
          <img 
            src={pages[pageIndex].imageUrl} 
            alt="Contenido" 
            style={{
              width: '70%', // Ajusta el ancho
              height: 'auto', // Mantiene la proporción de la imagen
              marginBottom: '15px'
            }}
          />
          <p style={{
            wordWrap: 'break-word',   // Asegura el salto de palabra
            whiteSpace: 'normal',     // Asegura que el texto salte de línea cuando sea necesario
            marginBottom: '15px',     // Espaciado entre párrafos
            fontSize: '16px',         // Tamaño de texto ajustable
            lineHeight: '1.6',        // Espaciado entre líneas para mejorar la legibilidad
            color: '#333',            // Color de texto (ajustable según el diseño)
            }}>
            {pages[pageIndex].text}
          </p>
        </div>
      ),
      showConfirmButton: true,
      confirmButtonText: pages[pageIndex].buttonText,
      allowOutsideClick: true,
      showCancelButton: true,
      cancelButtonText: 'Atrás',
      width: '50%',
      heightAuto: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (pageIndex < pages.length - 1) {
          showModal(pageIndex + 1); // Llama a showModal con la siguiente página
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (pageIndex > 0) {
          showModal(pageIndex - 1); // Llama a showModal con la página anterior
        }
      }
    });
  };

  return (
    <div>
      <button onClick={handleShowModal}>Guía de subida de archivos</button>
    </div>
  );
};

export default GuiaSubirArchivo;
