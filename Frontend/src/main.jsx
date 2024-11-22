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
import { PercepcionesComputacionalesDiaHoraPage } from "./pages/PercepcionesComputacionalesDiaHoraPage";
import { PercepcionesComputacionalesDiaPage } from "./pages/PercepcionesComputacionalesDiaPage";
import { PercepcionesComputacionalesPage } from "./pages/PercepcionesComputacionalesPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import App from "./App.jsx";
import { AgregarExcelPage } from "./pages/AgregarExcelPage.jsx";
import { MetricasEstacionPage } from "./pages/MetricasEstacionPage.jsx";
import { MetricasMensualHoraPage } from "./pages/MetricasMensualHoraPage.jsx";
import { MetricasEstacionGeneralMesPage } from "./pages/MetricasEstacionGeneralMesPage.jsx";
import { MetricasEstacionGeneralDiaPage } from "./pages/MetricasEstacionGeneralDiaPage.jsx";
import { MetricasEstacionHoraDiaPage } from "./pages/MetricasEstacionHoraDiaPage.jsx";
import { ResumenesPage } from "./pages/ResumenesPage.jsx";
import { DescripcionesInversorPage } from "./pages/DescripcionesInversorPage.jsx";
import { DescripcionesEstacionPage } from "./pages/DescripcionesEstacionPage.jsx";
import { InformesPage } from "./pages/InformesPage.jsx";
import { InformesEstacionPage } from "./pages/InformesEstacionPage.jsx";

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
        path: "/inversor/:id/produccion",
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
        path: "/estadisticas/metricas-estacion/mensual-hora",
        element: <MetricasMensualHoraPage />,
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
        path: "/PercepcionesComputacionales",
        element: <PercepcionesComputacionalesPage />,
      },
      {
        path: "/PercepcionesComputacionalesDiaHora",
        element: <PercepcionesComputacionalesDiaHoraPage />,
      },
      {
        path: "/PercepcionesComputacionalesDia",
        element: <PercepcionesComputacionalesDiaPage />,
      },
      {
        path: "/resumenes",
        element: <ResumenesPage />,
      },
      {
        path: "/resumenes/descripciones-inversor",
        element: <DescripcionesInversorPage />,
      },
      {
        path: "/resumenes/descripciones-estacion",
        element: <DescripcionesEstacionPage />,
      },
      {
        path: "/informes",
        element: <InformesPage />,
      },
      {
        path: "/informes/informes-estacion",
        element: <InformesEstacionPage />,
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

