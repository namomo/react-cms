import { useEffect } from 'react';
import './modal.css';

/**
 * 다목적 공용 모달 컴포넌트
 * useModal 훅과 함께 사용하여 필요한 화면에 마운트합니다.
 */
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  // ESC 키를 누르면 모달 닫기 지원
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 배경 딤(Dim) 처리 영역 클릭 시 모달 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="common-modal-overlay" onClick={handleOverlayClick}>
      <div className="common-modal-container">
        {title && (
          <div className="common-modal-header">
            <h3 className="common-modal-title">{title}</h3>
            <button className="common-modal-close-btn" onClick={onClose} aria-label="Close modal">
              &times;
            </button>
          </div>
        )}
        <div className="common-modal-body">
          {children}
        </div>
        {footer === undefined ? (
          <div className="common-modal-footer">
            <button className="common-modal-btn" onClick={onClose}>
              닫기
            </button>
          </div>
        ) : footer ? (
          <div className="common-modal-footer">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Modal;
