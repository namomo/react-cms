import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/auth-store';

/**
 * 라우팅(URL) 수준의 접근 통제 래퍼.
 * 현재 location.pathname이 user의 permissions 배열 내에 존재하는지 검사합니다.
 */
const RequirePermission = ({ children }) => {
  const { permissions, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // 로그인 상태가 아닐 땐 로그인 페이지로
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // permissions 배열 안의 설정 중 현재 경로를 허가하는 항목 찾기
  const hasAccess = permissions.some((p) => {
    // 루트(/) 는 정확히 일치해야 함
    if (p.path === '/') {
      return location.pathname === '/';
    }
    // 그 외 경로는 완전 일치하거나, 해당 경로의 하위 경로(/a/b)일 경우 통과
    return location.pathname === p.path || location.pathname.startsWith(`${p.path}/`);
  });

  if (!hasAccess) {
    console.warn(`[Guard] '${location.pathname}' 권한 부족으로 대시보드로 튕겨냅니다.`);
    // 권한이 없는 페이지 접근 시 대시보드로 튕겨냄 (또는 안내 페이지)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequirePermission;
