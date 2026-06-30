import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./router";

import "../styles/App.css";

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3000,

          style: {
            borderRadius: "14px",
            background: "#ffffff",
            color: "#0f172a",
            padding: "16px",
            fontSize: "14px",
            boxShadow: "0 12px 30px rgba(15,23,42,.12)",
          },

          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <AppRoutes />

    </BrowserRouter>
  );
}

export default App;