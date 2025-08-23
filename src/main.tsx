import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AnalyticsGateGA from "@/components/AnalyticsGateGA";
import { PageViewTracker } from "@/components/PageViewTracker";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnalyticsGateGA />
      <PageViewTracker /> {/* отправляет page_view на каждую смену маршрута */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

