import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

const PieChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Baja', 'Media', 'Alta'], // Etiquetas de las descripciones lingüísticas
        datasets: [
          {
            data: [data.DL_baja, data.DL_media, data.DL_alta], // Datos de las descripciones lingüísticas
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colores del gráfico
            hoverBackgroundColor: ['#FF4384', '#56A2EB', '#FFCE56']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return tooltipItem.raw + ' kWh'; // Mostrar los valores en kWh
              }
            }
          }
        }
      }
    });
  }, [data]);

  return <canvas ref={canvasRef} width="200" height="200"></canvas>;
};

export default PieChart;
