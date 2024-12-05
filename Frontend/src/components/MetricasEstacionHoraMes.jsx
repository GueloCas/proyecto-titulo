import { useEffect, useState } from "react";
import { getMetricasEstacionHoraMes } from "../api/estadisticas.api"; // Asegúrate de que esta función esté importada correctamente.
import { Link } from "react-router-dom";

export function MetricasEstacionHoraMes({ estacionId, anio, mes, hora }) {
  const [metricas, setMetricas] = useState([]);
  const [estacion, setEstacion] = useState(null);
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
        setMetricas(null);
        try {
          const data = await getMetricasEstacionHoraMes(estacionId, anio, mes, hora);
          setEstacion(data.estacion);
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

  if (!metricas) {
    return (
      <div className="text-center mt-4 d-flex justify-content-center align-items-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Cargando...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Mostrar mensaje de error */}
      {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

      {/* Información general de la estación */}
      {estacion && (
        <div className="card mt-4 p-4">
          <div className="card-header">
            <h4 className="ms-2">
              Métricas generales de <strong>{estacion.nombre}</strong> el mes <strong>{mes}-{anio}</strong> a las <strong>{hora}:00</strong>
            </h4>
          </div>
          <div className="row mt-4">
            <div className="col-sm-6 col-md-3">
              <div className="card card-stats card-primary card-round">
                <div className="card-body">
                  <div className="row">
                    <div className="col-5">
                      <div className="icon-big text-center">
                        <i><svg xmlns="http://www.w3.org/2000/svg" width="30" height="36" fill="currentColor" className="bi bi-clipboard2-check" viewBox="0 0 16 16">
                          <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z" />
                          <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z" />
                          <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
                        </svg></i>
                      </div>
                    </div>
                    <div className="col-7 col-stats">
                      <div className="numbers">
                        <p className="mb-0">Promedio de Estacion:</p>
                        <h4 className="card-title">{estacion.total_mensual.toFixed(3)} kWh</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="card card-stats card-info card-round">
                <div className="card-body">
                  <div className="row">
                    <div className="col-5">
                      <div className="icon-big text-center">
                        <i><svg xmlns="http://www.w3.org/2000/svg" width="30" height="36" fill="currentColor" className="bi bi-percent" viewBox="0 0 16 16">
                          <path d="M13.442 2.558a.625.625 0 0 1 0 .884l-10 10a.625.625 0 1 1-.884-.884l10-10a.625.625 0 0 1 .884 0M4.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m7 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                        </svg></i>
                      </div>
                    </div>
                    <div className="col-7 col-stats">
                      <div className="numbers">
                        <p className="mb-0">Promedio por Inversor:</p>
                        <h4 className="card-title">{estacion.promedio_inversor.toFixed(3)} kWh</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="card card-stats card-success card-round">
                <div className="card-body">
                  <div className="row">
                    <div className="col-5">
                      <div className="icon-big text-center">
                        <i><svg xmlns="http://www.w3.org/2000/svg" width="30" height="36" fill="currentColor" className="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                          <path d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5" />
                        </svg></i>
                      </div>
                    </div>
                    <div className="col-7 col-stats">
                      <div className="numbers">
                        <p className="mb-0">Mejor Inversor:</p>
                        <h4 className="card-title">{estacion.mejor_inversor.nombre} ({estacion.mejor_inversor.total.toFixed(3)} kWh)</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="card card-stats card-danger card-round">
                <div className="card-body">
                  <div className="row">
                    <div className="col-5">
                      <div className="icon-big text-center">
                        <i><svg xmlns="http://www.w3.org/2000/svg" width="30" height="36" fill="currentColor" className="bi bi-graph-down-arrow" viewBox="0 0 16 16">
                          <path d="M0 0h1v15h15v1H0zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5" />
                        </svg></i>
                      </div>
                    </div>
                    <div className="col-7 col-stats">
                      <div className="numbers">
                        <p className="mb-0">Peor Inversor:</p>
                        <h4 className="card-title">{estacion.peor_inversor.nombre} ({estacion.peor_inversor.total.toFixed(3)} kWh)</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de métricas */}
      <div className="card p-4">
        <div className="card-header">
          <h4 className="ms-2">
            Tabla de inversores de <strong>{estacion?.nombre}</strong> el mes <strong>{mes}-{anio}</strong> a las <strong>{hora}:00</strong>
          </h4>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>Inversor</th>
                <th>Promedio</th>
                <th>Mínimo</th>
                <th>Máximo</th>
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
                      <td>Sin Información</td>
                      <td>Sin Información</td>
                      <td>Sin Información</td>
                      <td>Sin Información</td>
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
                        {produccionHora.cantidad_promedio.toFixed(3)} kWh
                      </span>
                    </td>

                    {/* Mínimo */}
                    <td>
                      <span
                        className={esMaximoMin ? "promedio-maximo" : esMinimoMin ? "promedio-minimo" : ""}
                      >
                        {produccionHora.cantidad_minima} kWh
                      </span>
                    </td>

                    {/* Máximo */}
                    <td>
                      <span
                        className={esMaximoMax ? "promedio-maximo" : esMinimoMax ? "promedio-minimo" : ""}
                      >
                        {produccionHora.cantidad_maxima} kWh
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
