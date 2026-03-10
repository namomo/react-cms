// 애플리케이션 전역 설정 객체
// 런타임에 동적으로 변하지 않는 정적 UI/동작 옵션들을 관리합니다.
export const AppConfig = {
  ui: {
    showFooter: true, // Footer 노출 여부
    theme: 'light',   // 테마 정보 (추후 확장용)
  },
  api: {
    // API 관련 설정 (추후 확장용)
    timeout: 5000,
  }
};
