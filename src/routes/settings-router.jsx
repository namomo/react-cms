import ProfilePage from '../pages/settings/profile/profile-page';
import PermissionsPage from '../pages/settings/permissions/permissions-page';

// 설정(Settings) 메뉴에 속하는 라우트 정의
export const settingsRouter = [
  {
    path: 'settings/profile',
    element: <ProfilePage />,
  },
  {
    path: 'settings/permissions',
    element: <PermissionsPage />,
  },
];
