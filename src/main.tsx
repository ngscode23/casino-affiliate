// src/main.tsx
import "@fontsource-variable/inter/index.css"; // или "@fontsource-variable/inter/variable.css" если такой файл есть
import "./index.css";            // Tailwind/base
   // import "./styles/neon-theme.css"; // Твоя тема
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);