import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/main-layout/main-layout';
import AuthLayout from '../layouts/auth-layout/auth-layout';
import RequirePermission from './require-permission';

import DashboardPage from '../pages/dashboard/dashboard-page';
import LoginPage from '../pages/auth/login/login-page';
import { settingsRouter } from './settings-router';
import { contentRouter } from './content-router';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequirePermission>
        <MainLayout />
      </RequirePermission>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      ...settingsRouter,
      ...contentRouter,
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);

export default router;
