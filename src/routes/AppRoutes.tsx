// src/routes/router.ts
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import AdminRoutes from './AdminRoutes';

export const router = createBrowserRouter([
  ...AuthRoutes,
  ...AdminRoutes,
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  },
]);