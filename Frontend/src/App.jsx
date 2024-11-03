import { BrowserRouter, Routes, Route } from "react-router-dom"
import { InversoresPage } from "./pages/InversoresPage"
import AgregarExcelForm from "./components/AgregarExcelForm"
import { ProduccionInversorPage } from "./pages/ProduccionInversorPage"
import { ProduccionGraficoPage } from "./pages/ProduccionGraficoPage"
import { ProduccionGradosPage } from "./pages/ProduccionGradosPage"
import { ProduccionEstadisticasPage } from "./pages/ProduccionEstadisticasPage"
import { Navegacion } from "./components/Navegacion"
import ProduccionVLPage from "./pages/ProduccionVLPage"
import { PercepcionesComputacionalesDiaHoraPage } from "./pages/PercepcionesComputacionalesDiaHoraPage"
import { PercepcionesComputacionalesDiaPage } from "./pages/PercepcionesComputacionalesDiaPage"
import { PercepcionesComputacionalesPage } from "./pages/PercepcionesComputacionalesPage"

function App() {
  return (
    <BrowserRouter>
    <Navegacion />
      <Routes>
        <Route path="/Inversores" element={<InversoresPage />} />
        <Route path="/agregar-excel" element={<AgregarExcelForm />} />
        <Route path="/ProduccionInversor/:id" element={<ProduccionInversorPage />} />
        <Route path="/ProduccionInversor/grafico/:id" element={<ProduccionGraficoPage />} />
        <Route path="/ProduccionInversor/VLinguisticas" element={<ProduccionVLPage />} />
        <Route path="/ProduccionInversor/Estadisticas/:id" element={<ProduccionEstadisticasPage />} />
        <Route path="/ProduccionInversor/Grados/:id" element={<ProduccionGradosPage />} />
        <Route path="/PercepcionesComputacionales" element={<PercepcionesComputacionalesPage />} />
        <Route path="/PercepcionesComputacionalesDiaHora" element={<PercepcionesComputacionalesDiaHoraPage />} />
        <Route path="/PercepcionesComputacionalesDia" element={<PercepcionesComputacionalesDiaPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App