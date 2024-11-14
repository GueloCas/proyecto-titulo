import ReactDOM from "react-dom/client";
import '../scss/custom.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './pages/Root.jsx';  // La página raíz que contendrá las rutas principales
import ErrorPage from './pages/ErrorPage.jsx';  // Página para manejar errores
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
        path: "/inversores",
        element: <InversoresPage />,
      },
      {
        path: "/agregar-excel",
        element: <AgregarExcelPage />,
      },
      {
        path: "/ProduccionInversor/:id",
        element: <ProduccionInversorPage />,
      },
      {
        path: "/ProduccionInversor/grafico/:id",
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

