// routes/devices.routes.tsx
import type { RouteObject } from "react-router-dom";

import DeviceLayout from "@root/layouts/device/Device-layout.component";
import DevicePLC_IO from "@root/pages/device/sections/DevicePLC_IO/DevicePLC_IO.component";
import DeviceOverview from "@root/pages/device/sections/DeviceMACHINE_STATUS/DeviceMACHINE_STATUS.component";
import DevicePLC_DATA from "@root/pages/device/sections/DevicePLC_DATA/DevicePLC_DATA.component";
import DevicePLC_STATUS from "@root/pages/device/sections/DevicePLC_STATUS/DevicePLC_STATUS.component";
import { UserRoles } from "@root/utils/constants/userRoles";
import ProtectedRoute from "@root/components/shared/PretectedRoutes";
import DeviceDetailsPage from "@root/pages/device/sections/DeviceDetails/DeviceDetails.component";

// helper per wrappare comodamente - alternative approach if needed
const withGuard = (element: React.ReactElement, additionalProps?: any) => {
  return <ProtectedRoute {...additionalProps}>{element}</ProtectedRoute>;
};

// query guard: blocca ?edit=1 e "/edit" ai non-SUPER_ADMIN
const detailEditGuard = {
  param: "edit",
  allowRoles: [UserRoles.SUPER_ADMIN],
  // su questa route (index) possiamo applicarlo sempre, niente predicate
  stripPathSuffixes: ["/edit", "/edit/"],
};

const DevicesRoutes: RouteObject[] = [
  {
    path: "/device/:deviceId/*",
    element: withGuard(<DeviceLayout />), // parent: solo auth/base role checks
    children: [
      // Pagina DETTAGLIO (index): rimuovi ?edit=1 e /edit ai non-super admin
      {
        index: true,
        element: withGuard(<DeviceDetailsPage />, {
          queryGuards: [detailEditGuard],
        }),
      },

      // SOTTO-PAGINE: nessun guard per edit qui (i non-super admin possono usare edit)
      { path: "plc-io", element: withGuard(<DevicePLC_IO />) },
      { path: "plc-status", element: withGuard(<DevicePLC_STATUS />) },
      { path: "plc-data", element: withGuard(<DevicePLC_DATA />) },
      { path: "machine-status", element: withGuard(<DeviceOverview />) },
    ],
  },
];

export default DevicesRoutes;
