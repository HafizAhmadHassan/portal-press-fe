// routes/devices.routes.tsx
import type { RouteObject } from "react-router-dom";

import DeviceLayout from "@root/layouts/device/Device-layout.component";
import DevicePLC_IO from "@root/pages/device/sections/DevicePLC_IO/DevicePLC_IO.component";
import DeviceOverview from "@root/pages/device/sections/DeviceMACHINE_STATUS/DeviceMACHINE_STATUS.component";
import DevicePLC_DATA from "@root/pages/device/sections/DevicePLC_DATA/DevicePLC_DATA.component";
import DevicePLC_STATUS from "@root/pages/device/sections/DevicePLC_STATUS/DevicePLC_STATUS.component";
import DeviceDetailsPage from "@root/pages/device/sections/DeviceDetails/DeviceDetails.component";

import { UserRoles } from "@root/utils/constants/userRoles";
import ProtectedRoute from "@root/components/shared/PretectedRoutes";

// query guard: blocca ?edit=1 e "/edit" ai non-SUPER_ADMIN
const detailEditGuard = {
  param: "edit",
  allowRoles: [UserRoles.SUPER_ADMIN],
  stripPathSuffixes: ["/edit", "/edit/"],
};

const DevicesRoutes: RouteObject[] = [
  {
    path: "/device/:deviceId/*",
    element: (
      <ProtectedRoute
        requiredRoles={[UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER]}
      >
        <DeviceLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute queryGuards={[detailEditGuard]}>
            <DeviceDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "plc-io",
        element: (
          <ProtectedRoute
            requiredRoles={[
              UserRoles.ADMIN,
              UserRoles.SUPER_ADMIN,
              UserRoles.USER,
            ]}
          >
            <DevicePLC_IO />
          </ProtectedRoute>
        ),
      },
      {
        path: "plc-status",
        element: (
          <ProtectedRoute requiredRoles={[UserRoles.SUPER_ADMIN]}>
            <DevicePLC_STATUS />
          </ProtectedRoute>
        ),
      },
      {
        path: "plc-data",
        element: (
          <ProtectedRoute requiredRoles={[UserRoles.SUPER_ADMIN]}>
            <DevicePLC_DATA />
          </ProtectedRoute>
        ),
      },
      {
        path: "machine-status",
        element: (
          <ProtectedRoute
            requiredRoles={[
              UserRoles.ADMIN,
              UserRoles.SUPER_ADMIN,
              UserRoles.USER,
            ]}
          >
            <DeviceOverview />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default DevicesRoutes;
