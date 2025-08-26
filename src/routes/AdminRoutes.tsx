// routes/admin.routes.tsx
import { type RouteObject, Outlet } from "react-router-dom";

// Layout principale Admin (autenticazione richiesta ma nessun ruolo specifico)
import AdminLayout from "@layouts/admin/Admin-layout.component.tsx";

// Sezioni
import DevicesListSections from "@sections_admin/devicesList/Devices-list.sections.tsx";
import { UsersListSections } from "@sections_admin/usersList/Users-list.sections.tsx";
import OverviwSection from "@sections_admin/overview/Overview.sections.tsx";
import AnalyticsReportsSections from "@sections_admin/analytics/AnalyticsReports.sections.tsx";
import { TicketsListSections } from "@sections_admin/ticketsList/Ticket-list.section.tsx";
import { GpsListSections } from "@root/pages/admin/sections/gpsList/Gps-list.sections";

// Auth/ACL
import { UserRoles } from "@root/utils/constants/userRoles";
import ProtectedRoute from "@root/components/shared/PretectedRoutes";
import LogsListSections from "@root/pages/admin/sections/logsList/Logs-list.section";
// ⚠️ Attenzione al path/typo: assicurati che il file si chiami "ProtectedRoutes"

const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        // /admin
        index: true,
        element: (
          <ProtectedRoute
            requiredRoles={[
              UserRoles.ADMIN,
              UserRoles.SUPER_ADMIN,
              UserRoles.USER,
            ]}
          >
            <DevicesListSections />
          </ProtectedRoute>
        ),
      },
      {
        // /admin/machines
        path: "machines",
        element: (
          <ProtectedRoute
            requiredRoles={[
              UserRoles.ADMIN,
              UserRoles.SUPER_ADMIN,
              UserRoles.USER,
            ]}
          >
            <DevicesListSections />
          </ProtectedRoute>
        ),
      },
      {
        // /admin/users
        path: "users",
        element: (
          <ProtectedRoute
            requiredRoles={[
              UserRoles.SUPER_ADMIN,
              UserRoles.ADMIN,
              UserRoles.USER,
            ]}
          >
            <UsersListSections />
          </ProtectedRoute>
        ),
      },
      {
        // /admin/tickets
        path: "tickets",
        element: (
          <ProtectedRoute
            requiredRoles={[
              UserRoles.ADMIN,
              UserRoles.SUPER_ADMIN,
              UserRoles.USER,
            ]}
          >
            <TicketsListSections />
          </ProtectedRoute>
        ),
      },
      {
        // /admin/gps
        path: "gps",
        element: (
          <ProtectedRoute
            requiredRoles={[
              UserRoles.ADMIN,
              UserRoles.SUPER_ADMIN,
              UserRoles.USER,
            ]}
          >
            <GpsListSections />
          </ProtectedRoute>
        ),
      },
      {
        // /admin/logs
        path: "logs",
        element: (
          <ProtectedRoute
            requiredRoles={[
              UserRoles.ADMIN,
              UserRoles.SUPER_ADMIN,
              UserRoles.USER,
            ]}
          >
            <LogsListSections />
          </ProtectedRoute>
        ),
      },
      {
        // /admin/analytics  → sezione protetta per ADMIN e SUPER_ADMIN
        path: "analytics",
        element: (
          <ProtectedRoute
            requiredRoles={[UserRoles.ADMIN, UserRoles.SUPER_ADMIN]}
          >
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            // /admin/analytics/overview → SOLO SUPER_ADMIN
            path: "overview",
            element: (
              <ProtectedRoute requiredRoles={[UserRoles.SUPER_ADMIN]}>
                <OverviwSection />
              </ProtectedRoute>
            ),
          },
          {
            // /admin/analytics/reports → ADMIN + SUPER_ADMIN
            path: "reports",
            element: (
              <ProtectedRoute
                requiredRoles={[UserRoles.ADMIN, UserRoles.SUPER_ADMIN]}
              >
                <AnalyticsReportsSections />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
];

export default AdminRoutes;
