import { type RouteObject } from 'react-router-dom';
import ProtectedRoute from '@shared/PretectedRoutes.tsx';
import AdminLayout from '@layouts/admin/Admin-layout.component.tsx';
import DevicesListSections from '@sections_admin/devicesList/Devices-list.sections.tsx';
import { UsersListSections } from '@sections_admin/usersList/Users-list.sections.tsx';
import OverviwSection from '@sections_admin/overview/Overview.sections.tsx';
import AnalyticsReportsSections from '@sections_admin/analytics/AnalyticsReports.sections.tsx';
import { TicketsListSections } from '@sections_admin/ticketsList/Ticket-list.section.tsx';
import { GpsListSections } from '@root/admin/sections/gpsList/Gps-list.sections';

/*import AnalyticsReportsSection from '@sections_admin/analytics/reports/Analytics-reports.section.tsx';*/

const AdminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DevicesListSections />,  // Default /admin
      },
      {
        path: 'machines',
        element: <DevicesListSections />,
      },
      {
        path: 'users',
        element: <UsersListSections />,
      },
      {
        path: 'tickets',
        element: <TicketsListSections />,
      },
      {
        path: 'gps',
        element: <GpsListSections />,
      },
      {
        path: 'analytics',                // no wrapper component needed
        children: [
          {
            path: 'overview',
            element: <OverviwSection />,  // /admin/analytics
          },
          {
            path: 'reports',
            element: <AnalyticsReportsSections />,
          },
        ],
      },
     
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <div>Admin Panel</div>
      </ProtectedRoute>
    ),
  },
];

export default AdminRoutes;
