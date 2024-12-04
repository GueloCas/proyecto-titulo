import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { getDatosInformeInversor } from '../api/informes.api';

const GenerarPDF = ({ inversor, anio, mes }) => {
  const [data, setData] = useState([]);
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const [estadoInforme, setEstadoInforme] = useState("");

  useEffect(() => {
    if (!inversor || !anio || !mes) return;
    async function loadDatos() {
      setEstadoInforme("Generando...");
      try {
        setMostrarBoton(false);
        const datos = await getDatosInformeInversor(inversor);
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
    const listMargin = 40;
    const sectionMargin = 10;
    let yOffset = margin;

    const addTextToPage = (text, fontSize, lineHeight = 8) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, 180);
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
    doc.setFontSize(18);
    doc.text("Informe de Producción de Inversor", margin, yOffset);
    yOffset += 20;

    // Información del inversor (negrita, más grande)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14); // Título más grande
    doc.text("1-. Información del Inversor:", margin, yOffset);
    yOffset += 10;

    doc.setFontSize(12); // Restablecer el tamaño de fuente para la siguiente sección
    doc.setFont('helvetica', 'normal');
    // Aplicar listMargin para toda la información
    doc.text(`Inversor: ${data.inversor}`, listMargin, yOffset);
    yOffset += 10;
    doc.text(`Estación: ${data.estacion}`, listMargin, yOffset);
    yOffset += 10;
    doc.text(`Producción Total del Mes: ${data.produccion_total_mes} kWh`, listMargin, yOffset);
    yOffset += 10;
    doc.text(`Promedio Diario: ${data.promedio_diario.toFixed(2)} kWh`, listMargin, yOffset);
    yOffset += 10;

    yOffset += sectionMargin; // Añadir un margen entre secciones

    // Días con mayor producción
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("2-. Días con Mayor Producción:", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12); // Restablecer tamaño de fuente después del título
    doc.setFont('helvetica', 'normal');
    data.dias_mayor_produccion.forEach(dia => {
      if (yOffset + 10 > 280) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(`${dia[0]}: ${dia[1]} kWh`, listMargin, yOffset); // Aplicar listMargin aquí
      yOffset += 10;
    });

    yOffset += sectionMargin; // Añadir un margen entre secciones

    // Días con menor producción
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("3-. Días con Menor Producción:", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12); // Restablecer tamaño de fuente después del título
    doc.setFont('helvetica', 'normal');
    data.dias_menor_produccion.forEach(dia => {
      if (yOffset + 10 > 280) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(`${dia[0]}: ${dia[1]} kWh`, listMargin, yOffset); // Aplicar listMargin aquí
      yOffset += 10;
    });

    yOffset += sectionMargin; // Añadir un margen entre secciones

    // Estadísticas por hora
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("4-. Estadísticas por Hora:", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12); // Restablecer tamaño de fuente después del título
    doc.setFont('helvetica', 'normal');
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
      yOffset += 10;
    });

    yOffset += sectionMargin; // Añadir un margen entre secciones

    // Lista de todos los inversores con margen a la izquierda
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("5-. Posición de Inversores en el Top:", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12); // Restablecer tamaño de fuente después del título
    doc.setFont('helvetica', 'normal');
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
      yOffset += 10;
    });

    yOffset += sectionMargin; // Añadir un margen entre secciones

    // Sección de Descripción Lingüística
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("6-. Descripción Lingüística:", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    addTextToPage(`${data.descripcion_linguistica.DL_baja}`, 12);
    addTextToPage(`${data.descripcion_linguistica.DL_media}`, 12);
    addTextToPage(`${data.descripcion_linguistica.DL_alta}`, 12);

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
