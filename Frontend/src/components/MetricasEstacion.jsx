import { useEffect, useState } from "react";
import { getMetricasEstacion } from "../api/estadisticas.api"; // Asegúrate de que esta función esté importada correctamente.
import { Link } from "react-router-dom";

export function MetricasEstacion({ estacionId, anio, mes, hora }) {
  const [metricas, setMetricas] = useState([]);
  const [mensajeError, setMensajeError] = useState("");
  const [maxPromedio, setMaxPromedio] = useState(null);
  const [minPromedio, setMinPromedio] = useState(null);
  const [maxMinima, setMaxMinima] = useState(null);
  const [minMinima, setMinMinima] = useState(null);
  const [maxMaxima, setMaxMaxima] = useState(null);
  const [minMaxima, setMinMaxima] = useState(null);

  useEffect(() => {
    if (estacionId && anio && mes && hora) {
      async function loadMetricas() {
        try {
          const data = await getMetricasEstacion(estacionId, anio, mes);
          setMetricas(data.inversores || []);

          // Inicializar valores
          let maxProm = -Infinity, minProm = Infinity;
          let maxMin = -Infinity, minMin = Infinity;
          let maxMax = -Infinity, minMax = Infinity;

          data.inversores.forEach((inversor) => {
            const produccionHora = inversor.produccion.find(
              (produccion) => produccion.hora_num === parseInt(hora)
            );
            if (produccionHora) {
              // Encontrar el máximo y mínimo de cada columna
              if (produccionHora.cantidad_promedio > maxProm) maxProm = produccionHora.cantidad_promedio;
              if (produccionHora.cantidad_promedio < minProm) minProm = produccionHora.cantidad_promedio;

              if (produccionHora.cantidad_minima > maxMin) maxMin = produccionHora.cantidad_minima;
              if (produccionHora.cantidad_minima < minMin) minMin = produccionHora.cantidad_minima;

              if (produccionHora.cantidad_maxima > maxMax) maxMax = produccionHora.cantidad_maxima;
              if (produccionHora.cantidad_maxima < minMax) minMax = produccionHora.cantidad_maxima;
            }
          });

          setMaxPromedio(maxProm);
          setMinPromedio(minProm);
          setMaxMinima(maxMin);
          setMinMinima(minMin);
          setMaxMaxima(maxMax);
          setMinMaxima(minMax);
        } catch (error) {
          setMensajeError("Hubo un error al cargar las métricas.");
        }
      }
      loadMetricas();
    }
  }, [estacionId, anio, mes, hora]); // Se vuelve a ejecutar cuando cambia cualquiera de estos valores

  return (
    <div>
      {/* Mostrar mensaje de error */}
      {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

      {/* Tabla de métricas */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Inversor</th>
            <th>Promedio</th>
            <th>Mínimo</th>
            <th>Máximo</th>
            <th>Ver Gráfico</th>
          </tr>
        </thead>
        <tbody>
          {metricas.map((inversor) => {
            // Buscar la producción correspondiente a la hora seleccionada
            const produccionHora = inversor.produccion.find(
              (produccion) => produccion.hora_num === parseInt(hora)
            );
            if (!produccionHora) {
              return (
                <tr key={inversor.id}>
                  <td>{inversor.nombre}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              );
            }

            // Verificar si este promedio es el mayor o el menor
            const esMaximoProm = produccionHora.cantidad_promedio === maxPromedio;
            const esMinimoProm = produccionHora.cantidad_promedio === minPromedio;

            // Verificar si el mínimo es el mayor o el menor
            const esMaximoMin = produccionHora.cantidad_minima === maxMinima;
            const esMinimoMin = produccionHora.cantidad_minima === minMinima;

            // Verificar si el máximo es el mayor o el menor
            const esMaximoMax = produccionHora.cantidad_maxima === maxMaxima;
            const esMinimoMax = produccionHora.cantidad_maxima === minMaxima;

            return (
              <tr key={inversor.id}>
                <td>{inversor.nombre}</td>

                {/* Promedio */}
                <td>
                  <span
                    className={esMaximoProm ? "promedio-maximo" : esMinimoProm ? "promedio-minimo" : ""}
                  >
                    {produccionHora.cantidad_promedio.toFixed(3)}
                  </span>
                </td>

                {/* Mínimo */}
                <td>
                  <span
                    className={esMaximoMin ? "promedio-maximo" : esMinimoMin ? "promedio-minimo" : ""}
                  >
                    {produccionHora.cantidad_minima}
                  </span>
                </td>

                {/* Máximo */}
                <td>
                  <span
                    className={esMaximoMax ? "promedio-maximo" : esMinimoMax ? "promedio-minimo" : ""}
                  >
                    {produccionHora.cantidad_maxima}
                  </span>
                </td>
                {/* Ver gráfico */}
                <td>
                  <Link
                    to={`/inversor/${inversor.id}/produccion/grafico?hora=H${hora}`}
                    className="btn btn-secondary"
                  >
                    Ver Gráfico
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
