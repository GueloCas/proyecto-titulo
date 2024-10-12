import { BrowserRouter, Routes, Route } from "react-router-dom"
import { InversoresPage } from "./pages/InversoresPage"
import AgregarExcelForm from "./components/AgregarExcelForm"
import { ProduccionInversorPage } from "./pages/ProduccionInversorPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Inversores" element={<InversoresPage />} />
        <Route path="/agregar-excel" element={<AgregarExcelForm />} />
        <Route path="/ProduccionInversor/:id" element={<ProduccionInversorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App