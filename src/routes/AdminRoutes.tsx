// routes/admin.routes.tsx
import { type RouteObject } from 'react-router-dom';
// ATTENZIONE al path/typo:


import AdminLayout from '@layouts/admin/Admin-layout.component.tsx';
import DevicesListSections from '@sections_admin/devicesList/Devices-list.sections.tsx';
import { UsersListSections } from '@sections_admin/usersList/Users-list.sections.tsx';
import OverviwSection from '@sections_admin/overview/Overview.sections.tsx';
import AnalyticsReportsSections from '@sections_admin/analytics/AnalyticsReports.sections.tsx';
import { TicketsListSections } from '@sections_admin/ticketsList/Ticket-list.section.tsx';
import { GpsListSections } from '@root/admin/sections/gpsList/Gps-list.sections';
import { UserRoles } from '@root/utils/constants/userRoles';
import ProtectedRoute from '@root/components/shared/PretectedRoutes';


const AdminRoutes: RouteObject[] = [
  {
    path: '/admin',
    // Qui basta essere autenticati (nessun ruolo specifico)
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // /admin
        element: (
          <ProtectedRoute requiredRoles={[UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER]}>
            <DevicesListSections />
          </ProtectedRoute>
        ),
      },
      {
        path: 'machines',
        element: (
          <ProtectedRoute requiredRoles={[UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER]}>
            <DevicesListSections />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute requiredRoles={[UserRoles.ADMIN, UserRoles.USER]}>
            <UsersListSections />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tickets',
        element: (
          <ProtectedRoute requiredRoles={[UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER]}>
            <TicketsListSections />
          </ProtectedRoute>
        ),
      },
      {
        path: 'gps',
        element: (
          <ProtectedRoute requiredRoles={[UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.DRIVER]}>
            <GpsListSections />
          </ProtectedRoute>
        ),
      },
      {
        // Intera sezione analytics accessibile solo ad ADMIN e SUPER_ADMIN
        path: 'analytics',
        element: (
          <ProtectedRoute requiredRoles={[UserRoles.ADMIN, UserRoles.SUPER_ADMIN]}>
            {/* Outlet verrà reso perché ProtectedRoute restituisce children */}
            <div />
          </ProtectedRoute>
        ),
        children: [
          {
            // Esempio di rotta SOLO per SUPER_ADMIN
            path: 'overview',
            element: (
              <ProtectedRoute requiredRole={UserRoles.SUPER_ADMIN}>
                <OverviwSection />
              </ProtectedRoute>
            ),
          },
          {
            path: 'reports',
            element: (
              <ProtectedRoute requiredRoles={[UserRoles.ADMIN, UserRoles.SUPER_ADMIN]}>
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
