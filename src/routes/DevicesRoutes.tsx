// routes/devices.routes.tsx
import ProtectedRoute from "@root/components/shared/PretectedRoutes";
import DeviceLayout from "@root/layouts/device/Device-layout.component";
import DeviceDetailsPage from "@root/pages/device/sections/DeviceDetails/DeviceDetails.component";
import DeviceEditPage from "@root/pages/device/sections/DeviceEdit/DeviceEdit.component";
import DeviceOverview from "@root/pages/device/sections/DeviceOverview/DeviceOverview.component";
import DevicePLC_DATA from "@root/pages/device/sections/DevicePLC_DATA/DevicePLC_DATA.component";
import DevicePLC_IO from "@root/pages/device/sections/DevicePLC_IO/DevicePLC_IO.component";
import DevicePLC_STATUS from "@root/pages/device/sections/DevicePLC_STATUS/DevicePLC_STATUS.component";
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
      { index: true, element: <DeviceDetailsPage /> },
      { path: "edit", element: <DeviceEditPage /> },
      { path: "plc-io", element: <DevicePLC_IO /> },
      { path: "plc-status", element: <DevicePLC_STATUS /> },
      { path: "plc-data", element: <DevicePLC_DATA /> },
      { path: "machine-status", element: <DeviceOverview /> },
    ],
  },
];

export default DevicesRoutes;
