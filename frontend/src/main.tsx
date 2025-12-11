import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { AppProvider } from "./contexts/AppContext";
import { ThemeProvider } from "./contexts/ThemeContext";  // <-- ADD THIS

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
