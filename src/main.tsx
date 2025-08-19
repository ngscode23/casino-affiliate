// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error('В index.html нет <div id="root"></div>');
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);