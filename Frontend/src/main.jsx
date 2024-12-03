import ReactDOM from "react-dom/client";
import '../scss/custom.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './pages/Root.jsx';  // La página raíz que contendrá las rutas principales
import ErrorPage from './pages/ErrorPage.jsx';  // Página para manejar errores
import { EstacionesPage } from "./pages/EstacionesPage";
import { InversoresPage } from "./pages/InversoresPage";
import { ProduccionInversorPage } from "./pages/ProduccionInversorPage";
import { ProduccionGraficoPage } from "./pages/ProduccionGraficoPage";
import { ProduccionGradosPage } from "./pages/ProduccionGradosPage";
import { ProduccionEstadisticasPage } from "./pages/ProduccionEstadisticasPage";
import ProduccionVLPage from "./pages/ProduccionVLPage";
import { PercepcionesSegundoGradoDiaHoraPage } from "./pages/PercepcionesSegundoGradoDiaHoraPage";
import { PercepcionesSegundoGradoDiaPage } from "./pages/PercepcionesSegundoGradoDiaPage";
import { PercepcionesSegundoGradoPage } from "./pages/PercepcionesSegundoGradoPage.jsx";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import App from "./App.jsx";
import { AgregarExcelPage } from "./pages/AgregarExcelPage.jsx";
import { MetricasEstacionPage } from "./pages/MetricasEstacionPage.jsx";
import { MetricasEstacionGeneralMesPage } from "./pages/MetricasEstacionGeneralMesPage.jsx";
import { MetricasEstacionGeneralDiaPage } from "./pages/MetricasEstacionGeneralDiaPage.jsx";
import { MetricasEstacionHoraDiaPage } from "./pages/MetricasEstacionHoraDiaPage.jsx";
import { ResumenesPage } from "./pages/ResumenesPage.jsx";
import { DescripcionesInversorPage } from "./pages/DescripcionesInversorPage.jsx";
import { DescripcionesEstacionPage } from "./pages/DescripcionesEstacionPage.jsx";
import { InformesPage } from "./pages/InformesPage.jsx";
import { InformeEstacionPage } from "./pages/InformeEstacionPage.jsx";
import { MetricasEstacionHoraMesPage } from "./pages/MetricasEstacionHoraMesPage.jsx";
import { PercepcionesPrimerGradoPage } from "./pages/PercepcionesPrimerGradoPage.jsx";
import { PercepcionesPrimerGradoDiaPage } from "./pages/PercepcionesPrimerGradoDiaPage.jsx";
import { PercepcionesPrimerGradoHoraPage } from "./pages/PercepcionesPrimerGradoHoraPage.jsx";
import { InformeInversorPage } from "./pages/InformeInversorPage.jsx";
import {EditarPerfilPage} from "./pages/EditarPerfilPage.jsx";

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Root />,  
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,  // Página pública de inicio
      },
      {
        path: "/editar-perfil",
        element: <EditarPerfilPage />,
      },
      {
        path: "/estaciones",
        element: <EstacionesPage />,
      },
      {
        path: "/inversores",
        element: <InversoresPage />,
      },
      {
        path: "/agregar-datos",
        element: <AgregarExcelPage />,
      },
      {
        path: "/producciones/inversor",
        element: <ProduccionInversorPage />,
      },
      {
        path: "/inversor/:id/produccion/grafico",
        element: <ProduccionGraficoPage />,
      },
      {
        path: "/ProduccionInversor/VLinguisticas",
        element: <ProduccionVLPage />,
      },
      {
        path: "/ProduccionInversor/Estadisticas/:id",
        element: <ProduccionEstadisticasPage />,
      },
      {
        path: "/ProduccionInversor/Grados/:id",
        element: <ProduccionGradosPage />,
      },
      {
        path: "/estadisticas/metricas-estacion",
        element: <MetricasEstacionPage />,
      },
      {
        path: "/estadisticas/metricas-estacion/hora-mes",
        element: <MetricasEstacionHoraMesPage />,
      },
      {
        path: "/estadisticas/metricas-estacion/general-mes",
        element: <MetricasEstacionGeneralMesPage />,
      },
      {
        path: "/estadisticas/metricas-estacion/general-dia",
        element: <MetricasEstacionGeneralDiaPage />,
      },
      {
        path: "/estadisticas/metricas-estacion/hora-dia",
        element: <MetricasEstacionHoraDiaPage />,
      },
      {
        path: "/percepciones-segundo-grado",
        element: <PercepcionesSegundoGradoPage />,
      },
      {
        path: "/percepciones-segundo-grado/dia-hora",
        element: <PercepcionesSegundoGradoDiaHoraPage />,
      },
      {
        path: "/percepciones-segundo-grado/dia",
        element: <PercepcionesSegundoGradoDiaPage />,
      },
      {
        path: "/percepciones-primer-grado",
        element: <PercepcionesPrimerGradoPage />,
      },
      {
        path: "/percepciones-primer-grado/dia",
        element: <PercepcionesPrimerGradoDiaPage />,
      },
      {
        path: "/percepciones-primer-grado/hora",
        element: <PercepcionesPrimerGradoHoraPage />,
      },
      {
        path: "/resumenes",
        element: <ResumenesPage />,
      },
      {
        path: "/resumenes/resumenes-inversor",
        element: <DescripcionesInversorPage />,
      },
      {
        path: "/resumenes/resumenes-estacion",
        element: <DescripcionesEstacionPage />,
      },
      {
        path: "/informes",
        element: <InformesPage />,
      },
      {
        path: "/informes/informe-estacion",
        element: <InformeEstacionPage />,
      },
      {
        path: "/informes/informe-inversor",
        element: <InformeInversorPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage/>,  // Página pública de inicio
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

