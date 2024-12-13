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
      buttonText: 'Siguiente'
    },
    {
      title: 'Como actualizar los datos',
      imageUrl: '../Formato Excel DATOS.png',
      text: 'Para actualizar los datos de una estación, vuelve a subir el archivo necesario de la estación, pero con los nuevos valores. Los datos se sobreescribirán.',
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
              width: '70%', 
              height: 'auto', 
              marginBottom: '15px'
            }}
          />
          <p style={{
            wordWrap: 'break-word',   
            whiteSpace: 'normal',    
            marginBottom: '15px',     
            fontSize: '16px',        
            lineHeight: '1.6',       
            color: '#333',            
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
      <button className='btn btn-info' onClick={handleShowModal}>Guía de subida de archivos</button>
    </div>
  );
};

export default GuiaSubirArchivo;
