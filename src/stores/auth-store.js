import { create } from 'zustand';
import { authService } from '../services/auth-service';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token') || null, // 초기 구동 시 스토리지에서 획득
  permissions: [], // 접근 권한 배열
  isAuthenticated: false,
  isInitialized: false, // 앱 진입 시 권한 체크 완료 여부

  login: (userData, token, userPermissions = []) => {
    localStorage.setItem('auth_token', token);
    set({ user: userData, token, permissions: userPermissions, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, permissions: [], isAuthenticated: false });
  },

  // 새로고침(또는 최초 구동) 시 실행할 검증 액션
  verifyAuth: async () => {
    const { token, logout } = get();

    if (!token) {
      set({ isInitialized: true, isAuthenticated: false });
      return;
    }

    try {
      // 서비스 모듈을 통한 토큰 유효성 검사
      const response = await authService.verifyToken(token);

      if (response.success) {
        set({
          user: response.data.user,
          permissions: response.data.permissions || [],
          isAuthenticated: true,
          isInitialized: true
        });
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.warn('토큰 검증 실패. 로그아웃 처리:', error);
      logout();
      set({ isInitialized: true });
    }
  }
}));

export default useAuthStore;
