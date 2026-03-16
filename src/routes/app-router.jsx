import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/main-layout/main-layout';
import AuthLayout from '../layouts/auth-layout/auth-layout';
import RequirePermission from './require-permission';

import LoginPage from '../pages/auth/login/login-page';
import { appMenus } from '../config/menu';

// 다층 구조의 메뉴 트리를 순회하여, 
// react-router-dom이 인식할 수 있는 평탄화(flat)된 1차원 라우트 배열로 변환하는 유틸리티 함수
const generateRoutesForMenu = (menus) => {
  let routes = [];
  menus.forEach(menu => {
    // path와 element가 둘 다 있으면 실제로 라우팅 가능한 노드입니다.
    if (menu.path && menu.element) {
      routes.push({
        path: menu.path === '/' ? undefined : menu.path, // index route 인 경우 path를 빼고 index: true 로 뎁스를 올려줄 수 있음
        index: menu.path === '/',
        element: menu.element
      });
    }
    // 하위 자식이 있으면 재귀 호출로 경로를 모아 배열에 추가합니다.
    if (menu.children && menu.children.length > 0) {
      routes = [...routes, ...generateRoutesForMenu(menu.children)];
    }
  });
  return routes;
};

const dynamicRoutes = generateRoutesForMenu(appMenus);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequirePermission>
        <MainLayout />
      </RequirePermission>
    ),
    children: [
      ...dynamicRoutes
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
