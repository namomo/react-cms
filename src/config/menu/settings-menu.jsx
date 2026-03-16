import ProfilePage from '../../pages/settings/profile/profile-page';
import PermissionsPage from '../../pages/settings/permissions/permissions-page';

export const settingsMenu = {
  title: '설정',
  children: [
    {
      path: '/settings/profile',
      title: '사용자 정보',
      element: <ProfilePage />,
    },
    {
      path: '/settings/permissions',
      title: '권한 관리',
      element: <PermissionsPage />,
    },
  ],
};
