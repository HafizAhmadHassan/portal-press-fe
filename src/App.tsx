import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes.tsx";
import "./App.module.scss";
import { InstallPWAButton } from "@components/shared/pwa/InstallPWAButton";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <InstallPWAButton />
    </>
  );
}

export default App;
