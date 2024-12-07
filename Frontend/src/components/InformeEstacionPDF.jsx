import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { getDatosInformeEstacion } from '../api/informes.api';
import { set } from 'react-hook-form';
import { getMesLabel } from '../utils/dateHelpers';

const GenerarPDF = ({ estacion, anio, mes }) => {
    const [data, setData] = useState([]);
    const [mesNombre, setMesNombre] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [mostrarBoton, setMostrarBoton] = useState(false);
    const [estadoInforme, setEstadoInforme] = useState("");

    useEffect(() => {
        if (!estacion || !anio || !mes) return;
        async function loadDatos() {
            setEstadoInforme("Generando...");
            try {
                const mesLabel = getMesLabel(mes);
                setMesNombre(mesLabel); 

                setMostrarBoton(false);
                const datos = await getDatosInformeEstacion(estacion, anio, mes);
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
    }, [estacion, anio, mes]); // Añadir `anio` y `mes` como dependencias  

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
        const titulo = `Informe de Producción de ${data.estacion.nombre}`;
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
        doc.text("1-. Producción Mensual:", margin, yOffset);
        yOffset += 10;

        doc.setFontSize(12); // Restablecer el tamaño de fuente para la siguiente sección
        doc.setFont('helvetica', 'normal');
        addTextToPage(
            `La cantidad total de producción el mes ${mesNombre} de ${anio} fue de ${data.estacion.total_mensual} kWh, con un promedio por inversor de ${data.estacion.promedio_inversores} kWh. La producción por inversor fue la siguiente:`,
            12
        );
        yOffset += 5;
        data.produccion_mensual_inversores.forEach((inversor, index) => {
            if (yOffset + 10 > 280) {
                doc.addPage();
                yOffset = margin;
            }
            doc.text(`${index + 1}.    ${inversor.inversor_nombre}:  ${inversor.total_mensual_inversor} kWh`, listMargin, yOffset); // Aplicar listMargin aquí
            yOffset += 5;
        });

        yOffset += sectionMargin;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14); // Título más grande
        doc.text("2-. Producción Diaria:", margin, yOffset);
        yOffset += 10;

        doc.setFontSize(12); // Restablecer el tamaño de fuente para la siguiente sección
        doc.setFont('helvetica', 'normal');
        // Producción Diaria
        addTextToPage(
            `La cantidad promedio de producción diaria durante el mes ${mesNombre} de ${anio} fue de ${data.estacion.promedio_diario} kWh. La producción por día (ordenadas de mayor a menor) fue la siguiente:`,
            12
        );
        yOffset += 5;
        data.estacion.produccion_diaria.forEach((dia, index) => {
            if (yOffset + 10 > 280) {
                doc.addPage();
                yOffset = margin;
            }
            doc.text(`${index + 1}.    Día ${dia.dia}:  ${dia.produccion} kWh`, listMargin, yOffset); // Aplicar listMargin aquí
            yOffset += 5;
        });

        yOffset += sectionMargin;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14); // Título más grande
        doc.text("3-. Resumen Estación:", margin, yOffset);
        yOffset += 10;

        doc.setFontSize(12); // Restablecer el tamaño de fuente para la siguiente sección
        doc.setFont('helvetica', 'normal');
        doc.text(`El resumen de percepciones de segundo grado de la estación fue el siguiente:`, margin, yOffset);
        yOffset += 10;
        doc.text(`El ${data.descripciones_linguisticas.porcentaje_baja}% de las horas la cantidad de producción fue MALA`, listMargin, yOffset);
        yOffset += 5;
        doc.text(`El ${data.descripciones_linguisticas.porcentaje_normal}% de las horas la cantidad de producción fue NORMAL`, listMargin, yOffset);
        yOffset += 5;
        doc.text(`El ${data.descripciones_linguisticas.porcentaje_excelente}% de las horas la cantidad de producción fue EXCELENTE`, listMargin, yOffset);
        yOffset += 5;

        yOffset += sectionMargin;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14); // Título más grande
        doc.text("4-. Resumen por Inversor:", margin, yOffset);
        yOffset += 10;

        doc.setFontSize(12); // Restablecer el tamaño de fuente para la siguiente sección
        doc.setFont('helvetica', 'normal');
        doc.text(`El resumen de percepciones de primer grado de los inversores de la estación fue el siguiente:`, margin, yOffset);
        yOffset += 10;

        data.descripciones_linguisticas.inversores.forEach((inversor, index) => {
            if (yOffset + 20 > 280) {
                doc.addPage();
                yOffset = margin;
            }
            doc.text(`${index + 1}.    ${inversor.inversor_nombre}:  `, listMargin, yOffset); // Aplicar listMargin aquí
            yOffset += 5;
            doc.text(`El ${inversor.porcentaje_baja}% de las horas la cantidad de produccion fue BAJA`, listMargin, yOffset);
            yOffset += 5;
            doc.text(`El ${inversor.porcentaje_media}% de las horas la cantidad de produccion fue MEDIA`, listMargin, yOffset);
            yOffset += 5;
            doc.text(`El ${inversor.porcentaje_alta}% de las horas la cantidad de produccion fue ALTA`, listMargin, yOffset);
            yOffset += 10;
        });

        // Guardar PDF
        doc.save(`Informe ${data.estacion.nombre} ${mesNombre}-${anio}.pdf`);
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
