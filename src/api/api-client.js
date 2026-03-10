import useAuthStore from '../stores/auth-store';
import useUiStore from '../stores/ui-store';

/**
 * 더미 API 클라이언트
 * Service 계층에서 주어진 데이터(dummyData)를 단순 지연(delay) 후 반환합니다.
 * 더 이상 특정 JSON 파일의 경로 매핑에 의존하지 않습니다.
 */
export const dummyRequest = async (dummyData, delay = 1000, errorConfig = null) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 강제 에러 방출 설정이 켜져있을 경우
      if (errorConfig && errorConfig.shouldFail) {
        const status = errorConfig.status || 500;
        const errorMsg = errorConfig.message || `[Mock Error] 서버 통신 오류가 발생했습니다. (${status})`;

        if (status === 401) {
          useAuthStore.getState().logout();
          reject(new Error('인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.'));
          return;
        }

        if (status >= 500 || status === 403 || status === 404) {
          useUiStore.getState().showError(errorMsg);
        }

        reject(new Error(errorMsg));
      } else {
        resolve(dummyData.default || dummyData);
      }
    }, delay);
  });
};

/**
 * 범용 API Fetch 클라이언트 (Real API)
 * 통신 시 공통 토큰(Authorization) 자동 주입 및 전역 에러 핸들링 인터셉터 역할을 수행합니다.
 */
export const request = async (url, options = {}) => {
  try {
    // 1. 공통 헤더 주입 로직
    // 스토어에서 직접 가져오므로 프론트 개발자가 매번 헤더에 토큰을 심을 필요 없음
    const token = useAuthStore.getState().token;
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // 2. 응답 상태 가로채기 (인터셉터)
    if (!response.ok) {
      // 2-1. 401 Unauthorized 방어 (세션 파괴 및 리다이렉트 발생)
      if (response.status === 401) {
        useAuthStore.getState().logout();
        throw new Error('인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
      }

      const errorMsg = `서버 통신 오류가 발생했습니다. (${response.status})`;

      // 2-2. 500, 403 등 치명적 에러 감지 시 스토어 연동 (UI는 나중에 모달로 연동)
      if (response.status >= 500 || response.status === 403 || response.status === 404) {
        useUiStore.getState().showError(errorMsg);
      }

      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
};
