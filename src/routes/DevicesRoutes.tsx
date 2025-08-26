// routes/devices.routes.tsx
import ProtectedRoute from "@root/components/shared/PretectedRoutes";
import DeviceLayout from "@root/layouts/device/Device-layout.component";
import DeviceDetailsPage from "@root/pages/device/sections/DeviceDetails/DeviceDetails.component";
import DeviceEditPage from "@root/pages/device/sections/DeviceEdit/DeviceEdit.component";
import DeviceOverview from "@root/pages/device/sections/DeviceOverview/DeviceOverview.component";
import type { RouteObject } from "react-router-dom";

const DevicesRoutes: RouteObject[] = [
  {
    path: "/device/:deviceId/*",
    element: (
      <ProtectedRoute>
        <DeviceLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DeviceDetailsPage /> }, // <-- dettagli (questa pagina)
      { path: "edit", element: <DeviceEditPage /> }, // <-- già creata prima
      { path: "machine-status", element: <DeviceOverview /> }, // overview
    ],
  },
];

export default DevicesRoutes;
