import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.module.scss";
import App from "./App.tsx";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import { ToastProvider } from "@shared/toast/Toast.context.tsx";
import "./pages/admin/styles/globals.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </StrictMode>
);
