import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes.tsx";
import "./App.module.scss";
import { InstallPWAButton } from "@components/shared/pwa/InstallPWAButton";
import { onMessageListener } from "./firebase/firebaseConfig";
import { useToast } from "@/lib/toast";

function App() {
  const toast = useToast();

  useEffect(() => {
    // ✅ Gestisci messaggi in foreground con Toast invece di alert
    onMessageListener().then((payload: unknown) => {
      console.log("🔔 Notifica ricevuta in foreground:", payload);

      if (typeof payload === "object" && payload !== null) {
        const message = payload as {
          notification?: {
            title?: string;
            body?: string;
          };
        };

        // 🍞 Mostra toast invece di alert
        toast.info(
          message.notification?.body || "Nuova notifica ricevuta",
          message.notification?.title || "Notifica",
          6000 // 6 secondi
        );
      }
    });
  }, [toast]);

  return (
    <>
      <RouterProvider router={router} />
      <InstallPWAButton />
    </>
  );
}

export default App;
