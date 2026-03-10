import { create } from 'zustand';

/**
 * 전역 UI 요소(에러 모달창, 알림, 다이얼로그 등)의 상태를 관리하는 스토어
 */
const useUiStore = create((set) => ({
  globalError: null,
  showError: (message) => set({ globalError: message }),
  clearError: () => set({ globalError: null }),
}));

export default useUiStore;
