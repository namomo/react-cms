import { request, dummyRequest } from '../api/api-client';
import adminDummyData from '../api/dummy/admin.json';
import userDummyData from '../api/dummy/user.json';

// 개별 서비스 통신 모드 스위치 (개발 중: true, 백엔드 연동 완료 시: false)
const USE_MOCK = true;

/**
 * Auth 관련 API 서비스 모듈
 */
export const authService = {
  login: async (username, password) => {
    if (USE_MOCK) {
      if (username === 'admin') {
        return dummyRequest(adminDummyData, 1000);
      } else {
        // 기본적으로 그 외 아이디는 user 권한 부여
        return dummyRequest(userDummyData, 1000);
      }
    }

    // 2. 서버 연동 후: 실제 Fetch 요청 수행
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // 토큰 유효성 검증
  verifyToken: async (token) => {
    if (USE_MOCK) {
      if (!token) throw new Error('No Token');
      // 토큰 문자열 기반으로 역할 역판별하여 데이터 주입
      if (token === 'dummy-jwt-token-12345') {
        return dummyRequest(adminDummyData, 500);
      } else {
        return dummyRequest(userDummyData, 500);
      }
    }

    return request('/api/auth/verify', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
