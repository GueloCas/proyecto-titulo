import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const GuiaSubirArchivo = () => {

  const pages = [
    {
      imageUrl: 'https://via.placeholder.com/150',
      text: 'Esta es la página 1. Aquí va el contenido.',
      buttonText: 'Siguiente'
    },
    {
      imageUrl: 'https://via.placeholder.com/150',
      text: 'Esta es la página 2. Aquí va el contenido de la segunda página.',
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
          <img src={pages[pageIndex].imageUrl} alt="Contenido" style={{ width: '100%', marginBottom: '15px' }} />
          <p>{pages[pageIndex].text}</p>
        </div>
      ),
      showConfirmButton: true,
      confirmButtonText: pages[pageIndex].buttonText,
      allowOutsideClick: true,
      showCancelButton: true,
      cancelButtonText: 'Atrás'
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
