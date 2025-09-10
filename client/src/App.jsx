import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyApp from "./pages/MyApp";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<MyApp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
