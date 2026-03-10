import { useLocation } from 'react-router-dom';
import useAuthStore from '../stores/auth-store';

/**
 * 컴포넌트 내부(UI) 수준에서 세부 액션(CRUD 등) 버튼 노출 여부를 판별하는 훅.
 */
const usePermission = () => {
  const permissions = useAuthStore((state) => state.permissions);
  const location = useLocation();

  /**
   * @param {string} action - 확인할 액션 식별자 (예: 'CREATE', 'DELETE')
   * @param {string} [explicitPath] - 명시적으로 특정 경로의 권한을 확인할 때 사용. 미지정시 현재 경로 기준.
   * @returns {boolean} 해당 액션 권한이 있으면 true
   */
  const hasPermission = (action, explicitPath = null) => {
    const targetPath = explicitPath || location.pathname;

    // 해당 path에 일치하는 권한 객체 색인
    const permissionCheck = permissions.find((p) => {
      if (p.path === '/') return targetPath === '/';
      return targetPath === p.path || targetPath.startsWith(`${p.path}/`);
    });

    if (!permissionCheck) return false;
    if (!permissionCheck.actions) return false;

    // 특정 액션이 들어있거나, 마스터 권한('*')이 있는 경우 허용
    return permissionCheck.actions.includes(action) || permissionCheck.actions.includes('*');
  };

  return { hasPermission };
};

export default usePermission;
