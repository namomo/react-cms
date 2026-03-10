import { request, dummyRequest } from '../api/api-client';
import noticeDummyData from '../api/dummy/notice.json';

// 공지사항 서비스 통신 모드 스위치
const USE_MOCK = true;
// 더미 통신 시 강제로 에러를 발생시켜 에러 핸들링을 테스트하기 위한 스위치
const USE_MOCK_ERROR = false; // TODO: 에러 테스트 시 true로 변경

/**
 * Notice(공지사항) 관련 API 서비스 모듈
 */
export const noticeService = {
  // 로그인한 사용자용 맞춤형 공지사항 획득
  getPersonalNotice: async (userId) => {
    if (USE_MOCK) {
      // 1. 더미 통신: 준비된 notice.json 데이터를 api-client 에게 주입 (1초 뒤 반환)
      // (userId에 따라 데이터를 다르게 주는 처리도 이 안에서 할 수 있음)
      return dummyRequest(noticeDummyData, 1000, {
        shouldFail: USE_MOCK_ERROR,
        status: 404, // 테스트 용: 404 Not Found 에러 등
        message: '공지사항 데이터를 찾을 수 없습니다.'
        // status: 500, // 테스트 용: 401, 500, 403 등으로 변경하면서 확인
        // message: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      });
    }

    // 2. 실제 서버 통신
    return request(`/api/notice/${userId}`, {
      method: 'GET',
    });
  },
};
