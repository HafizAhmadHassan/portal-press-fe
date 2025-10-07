// src/routes/router.ts
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./AdminRoutes";
import DevicesRoutes from "./DevicesRoutes";
// Dev-only debug pages
import NotificationDebug from "@root/pages/_debug/NotificationDebug.page";

export const router = createBrowserRouter([
  ...AuthRoutes,
  ...AdminRoutes,
  ...DevicesRoutes,
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  // Dev routes
  {
    path: "/debug/notifications",
    element: <NotificationDebug />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
