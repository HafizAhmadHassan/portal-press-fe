import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.module.scss";
import App from "./App.tsx";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import { registerSW } from "virtual:pwa-register";
import { ToastProvider, ToastContainer } from "@/lib/toast";
import "@/lib/toast/toast.scss";
import "./pages/admin/styles/globals.scss";
/* import { TestAuth } from "./TestAuth.tsx"; */

// Registro SW con autoUpdate e prompt per aggiornare
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Possibile futura integrazione: mostrare toast custom per aggiornare
    if (confirm("Nuova versione disponibile. Aggiornare ora?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App pronta per funzionare offline");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
        <ToastContainer />
      </ToastProvider>
      {/* <TestAuth /> */}
    </Provider>
  </StrictMode>
);
