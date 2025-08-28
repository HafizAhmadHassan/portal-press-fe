// src/routes/AuthRoutes.tsx
import { Navigate, type RouteObject } from "react-router-dom";
import LoginLayout from "@root/layouts/login/Login-layout";

const AuthRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginLayout />,
  },
  {
    path: "/auth",
    element: <Navigate to="/login" replace />,
  },
];

export default AuthRoutes;
