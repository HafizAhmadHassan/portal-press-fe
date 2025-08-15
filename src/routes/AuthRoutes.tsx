// src/routes/AuthRoutes.tsx
import { Navigate, type RouteObject } from 'react-router-dom';
import LoginLayout from '@layouts/Login/Login-layout.tsx';

const AuthRoutes: RouteObject[] = [
  {
    path: '/login',
    element:  <LoginLayout />
  },
  {
    path: '/auth',
    element: <Navigate to="/login" replace />,
  },
];

export default AuthRoutes;