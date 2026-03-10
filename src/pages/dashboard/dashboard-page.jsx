import { useEffect, useState } from 'react';
import useAuthStore from '../../stores/auth-store';
import { noticeService } from '../../services/notice-service';
import useModal from '../../hooks/use-modal';
import Modal from '../../components/common/modal/modal';
import usePermission from '../../hooks/use-permission';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  // 동적 권한 제어 훅 (현재 Dashboard 경로 기준)
  const { hasPermission } = usePermission();

  // 공지사항 데이터 상태
  const [notice, setNotice] = useState(null);
  const [loadingNotice, setLoadingNotice] = useState(false);

  // 공통 모달 훅 사용
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    // 컴포넌트 마운트 및 사용자가 존재할 때 맞춤 공지 요청
    const fetchNotice = async () => {
      if (!user) return;

      setLoadingNotice(true);
      try {
        const response = await noticeService.getPersonalNotice(user.id || user.username);

        // 반환된 공지사항이 있다면 상태 세팅 후 모달 열기
        if (response.success && response.data) {
          setNotice(response.data);
          openModal();
        }
      } catch (error) {
        console.error('공지사항 로드 중 에러 발생:', error);
      } finally {
        setLoadingNotice(false);
      }
    };

    fetchNotice();
  }, [user, openModal]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>환영합니다, {user?.username}님!</p>

      {/* 동적 권한 제어(UI 가드) 검증용 영역 */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>[액션 권한 제어(UI Guard) 테스트]</h4>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          * 현재 대시보드 권한은 <strong>READ</strong>뿐입니다.
        </p>

        {/* READ 권한 확인 */}
        {hasPermission('READ') && (
          <button style={{ marginRight: '10px', padding: '8px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>
            나에겐 보이는 새로고침(READ) 버튼
          </button>
        )}

        {/* CREATE 권한 확인 */}
        {hasPermission('CREATE') && (
          <button style={{ padding: '8px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}>
            나에겐 안 보이는 추가(CREATE) 버튼
          </button>
        )}
      </div>

      {loadingNotice && <p style={{ color: 'gray', fontSize: '14px' }}>공지사항을 불러오는 중...</p>}

      {/* 공통 Modal 활용 */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={notice ? `${notice.title} (${notice.noticeId})` : '공지사항'}
      >
        {notice && (
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{notice.content}</p>
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
