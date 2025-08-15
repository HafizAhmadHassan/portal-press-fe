// src/routes/DevicesRoutes.tsx

import { type RouteObject } from 'react-router-dom';
import DashboardLayout from '@layouts/admin/Admin-layout.component';

const DevicesRoutes: RouteObject[] = [
  {
    element: <DashboardLayout />,
    /*children: [
      { path: '/auth', element: <AuthPage /> },
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      {
        path: '/shop/!*',
        children: [
          {
            path: '*',
            element: <ShopPage />,
          },
        ],
      },
      {
        path: '/product/:productId',
        element: <ProductDetail />,
      },
      {
        path: '/book-collect',
        children: [
          { index: true, element: <BookCollectPage /> },
          { path: ':productId', element: <BookCollectPage /> },
        ],
      },
      {
        path: '/cart',
        children: [
          { index: true, element: <CartPage /> },
          { path: ':cartId', element: <CartPage /> },
        ],
      },
      { path: '/contacts', element: <ContactPage /> },
      { path: '/resume/:orderId', element: <ResumePage /> },
      { path: '/privacy', element: <TestPage /> },
      { path: '/delete_account', element: <TestPage /> },
      { path: '/oauth2/redirect', element: <OAuth2RedirectHandler /> },
      { path: '/password-dimenticata', element: <ResetPasswordRequestPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/verifica-email', element: <VerificaEmail /> },
      { path: '/order-detail/:orderId', element: <OrderDetailPage /> },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],*/
  },
];

export default DevicesRoutes;
