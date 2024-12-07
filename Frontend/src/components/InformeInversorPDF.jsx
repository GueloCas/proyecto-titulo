import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { getDatosInformeInversor } from '../api/informes.api';
import { getMesLabel } from '../utils/dateHelpers';

const GenerarPDF = ({ inversor, anio, mes }) => {
  const [data, setData] = useState([]);
  const [mesNombre, setMesNombre] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const [estadoInforme, setEstadoInforme] = useState("");

  useEffect(() => {
    if (!inversor || !anio || !mes) return;
    async function loadDatos() {
      setEstadoInforme("Generando...");
      try {
        const mesLabel = getMesLabel(mes);
        setMesNombre(mesLabel);

        setMostrarBoton(false);
        const datos = await getDatosInformeInversor(inversor, anio, mes);
        console.log(datos);
        setData(datos);
        setMostrarBoton(true); // Activar botón una vez cargados los datos
        setEstadoInforme("Informe listo."); // Cambiar mensaje cuando se termine el PDF
      } catch (error) {
        setMensajeError("Hubo un error al cargar la información.");
        setEstadoInforme("Hubo un error al generar el informe"); // En caso de error
        setMostrarBoton(false); // Desactivar botón si hay error
      }
    }
    loadDatos();
  }, [inversor, anio, mes]); // Añadir `anio` y `mes` como dependencias  

  const generatePDF = async () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth()
    const listMargin = 40;
    const sectionMargin = 10;
    let yOffset = margin;

    const addTextToPage = (text, fontSize, lineHeight = 5) => {
      doc.setFontSize(fontSize);
      const maxWidth = 180; // Ajusta el ancho máximo para el texto
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach(line => {
        if (yOffset + lineHeight > 280) {
          doc.addPage();
          yOffset = margin;
        }
        doc.text(line, margin, yOffset);
        yOffset += lineHeight;
      });
    };

    // Título del PDF
    const titulo = `Informe de Producción de ${data.inversor}`;
    doc.setFontSize(18);
    const tituloWidth = doc.getTextWidth(titulo);
    const tituloX = (pageWidth - tituloWidth) / 2;
    doc.text(titulo, tituloX, yOffset);
    yOffset += 10; // Espacio entre título y subtítulo

    // Subtítulo del PDF
    const subtitulo = `en ${mesNombre} de ${anio}`;
    doc.setFontSize(16);
    const subtituloWidth = doc.getTextWidth(subtitulo);
    const subtituloX = (pageWidth - subtituloWidth) / 2;
    doc.text(subtitulo, subtituloX, yOffset);
    yOffset += 15; // Espacio después del subtítulo

    // Información del inversor (negrita, más grande)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14); // Título más grande
    doc.text("1-. Información del Inversor:", margin, yOffset);
    yOffset += 10;

    doc.setFontSize(12); // Restablecer el tamaño de fuente para la siguiente sección
    doc.setFont('helvetica', 'normal');
    // Aplicar listMargin para toda la información
    doc.text(`Inversor: ${data.inversor}`, listMargin, yOffset);
    yOffset += 5;
    doc.text(`Estación: ${data.estacion}`, listMargin, yOffset);
    yOffset += 5;
    doc.text(`Producción Total del Mes: ${data.produccion_total_mes} kWh`, listMargin, yOffset);
    yOffset += 5;

    yOffset += sectionMargin; // Añadir un margen entre secciones

    // Días con menor producción
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("2-. Producción diaria:", margin, yOffset);
    yOffset += 10;

    doc.setFontSize(12); // Restablecer el tamaño de fuente para la siguiente sección
    doc.setFont('helvetica', 'normal');
    addTextToPage(
      `La cantidad promedio de producción diaria durante el mes ${mesNombre} de ${anio} fue de ${data.promedio_diario} kWh. La producción por día (ordenadas de mayor a menor) fue la siguiente:`,
      12
    );
    yOffset += 5;
    data.produccion_diaria.forEach((dia, index) => {
      const [diaDelMes, produccion] = dia;
      if (yOffset + 10 > 280) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(`${index + 1}.    Día ${diaDelMes}:  ${produccion} kWh`, listMargin, yOffset);
      yOffset += 5;
    });
    yOffset += sectionMargin; // Añadir un margen entre secciones

    // Estadísticas por hora
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("3-. Estadísticas por Hora:", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12); // Restablecer tamaño de fuente después del título
    doc.setFont('helvetica', 'normal');
    addTextToPage(
      `A continuación se muestra la tabla de estadísticas de producción por hora en el mes ${mesNombre} de ${anio}:`,
      12
    );
    yOffset += 5;
    data.estadisticas.forEach(stat => {
      if (yOffset + 10 > 280) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(
        `Hora ${stat.hora_num}: Min: ${stat.cantidad_minima} kWh, Max: ${stat.cantidad_maxima} kWh, Promedio: ${stat.cantidad_promedio.toFixed(2)} kWh`,
        listMargin,
        yOffset // Aplicar listMargin aquí
      );
      yOffset += 5;
    });

    yOffset += sectionMargin; // Añadir un margen entre secciones

    // Lista de todos los inversores con margen a la izquierda
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("4-. Comparación de inversores:", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12); // Restablecer tamaño de fuente después del título
    doc.setFont('helvetica', 'normal');
    addTextToPage(
      `El inversor ${data.inversor} ocupa la posición ${data.posicion_en_top} de ${data.total_inversores} dentro los inversores de ${data.estacion} en el mes ${mesNombre} de ${anio}. La producción de los inversores fue la siguiente:`,
      12
    );
    yOffset += 5;
    data.todos_inversores.forEach((inversor, index) => {
      const isCurrentInversor = inversor[0] === data.inversor; // Verificar si es el inversor actual

      if (isCurrentInversor) {
        doc.setFont('helvetica', 'bold'); // Resalta toda la línea con negrita
      } else {
        doc.setFont('helvetica', 'normal'); // Restaura a la fuente normal
      }

      // Imprime la posición, nombre del inversor y producción en una línea, con margen adicional a la izquierda
      if (yOffset + 10 > 280) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(`${index + 1}. ${inversor[0]} ${inversor[1]} kWh`, listMargin, yOffset); // Aplicar listMargin aquí
      yOffset += 5;
    });

    yOffset += sectionMargin; // Añadir un margen entre secciones

    // Sección de Descripción Lingüística
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("5-. Resumen:", margin, yOffset);
    yOffset += 10;

    doc.setFontSize(12); // Restablecer el tamaño de fuente para la siguiente sección
    doc.setFont('helvetica', 'normal');
    addTextToPage(
      `El resumen de percepciones de primer grado de ${data.inversor} en el mes ${mesNombre} de ${anio} fue el siguiente:`,
      12
    );
    yOffset += 5;
    doc.text(`El ${data.descripcion_linguistica.porcentaje_baja}% de las horas la cantidad de producción fue BAJA`, listMargin, yOffset);
    yOffset += 5;
    doc.text(`El ${data.descripcion_linguistica.porcentaje_media}% de las horas la cantidad de producción fue MEDIA`, listMargin, yOffset);
    yOffset += 5;
    doc.text(`El ${data.descripcion_linguistica.porcentaje_alta}% de las horas la cantidad de producción fue ALTA`, listMargin, yOffset);
    yOffset += 5;

    // Guardar PDF
    doc.save(`informe_inversor_${data.inversor}.pdf`);
    setTimeout(() => setEstadoInforme(""), 3000); // Ocultar mensaje después de 3 segundos

  };

  return (
    <div>
      <button
        className="btn btn-success mt-4"
        disabled={!mostrarBoton || data.length === 0} // También verificamos si `data` está vacío
        onClick={generatePDF}
      >
        Descargar PDF
      </button>
      {mensajeError && <p>{mensajeError}</p>}
      {estadoInforme && <p className="text-dark fs-6">{estadoInforme}</p>}
    </div>
  );
};

export default GenerarPDF;
