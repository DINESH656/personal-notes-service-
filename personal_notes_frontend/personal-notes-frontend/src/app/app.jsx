import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router";
import "../styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
