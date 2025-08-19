// src/main.tsx
import '@fontsource-variable/inter/index.css'; // <= важно: /index.css
import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";


const container = document.getElementById("root");
if (!container) {
  throw new Error('В index.html нет <div id="root"></div>');
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);