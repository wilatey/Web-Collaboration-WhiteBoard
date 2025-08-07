import { BrowserRouter, Route, Routes } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { Dashboard } from "./pages/Dashboard"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />}></Route>
          <Route index element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
