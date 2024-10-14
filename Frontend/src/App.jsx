import { BrowserRouter, Routes, Route } from "react-router-dom"
import { InversoresPage } from "./pages/InversoresPage"
import AgregarExcelForm from "./components/AgregarExcelForm"
import { ProduccionInversorPage } from "./pages/ProduccionInversorPage"
import { ProduccionGraficoPage } from "./pages/ProduccionGraficoPage"
import { Navegacion } from "./components/Navegacion"

function App() {
  return (
    <BrowserRouter>
    <Navegacion />
      <Routes>
        <Route path="/Inversores" element={<InversoresPage />} />
        <Route path="/agregar-excel" element={<AgregarExcelForm />} />
        <Route path="/ProduccionInversor/:id" element={<ProduccionInversorPage />} />
        <Route path="/ProduccionInversor/grafico/:id" element={<ProduccionGraficoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App