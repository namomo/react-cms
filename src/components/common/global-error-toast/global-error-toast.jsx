import { useEffect } from 'react';
import useUiStore from '../../../stores/ui-store';
import './global-error-toast.css';

const GlobalErrorToast = () => {
  const { globalError, clearError } = useUiStore();

  useEffect(() => {
    if (globalError) {
      // 에러 발생 시 5초 후 자동으로 닫히도록 설정
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [globalError, clearError]);

  if (!globalError) return null;

  return (
    <div className="global-error-toast-overlay">
      <div className="global-error-toast-content">
        <span className="global-error-toast-icon">⚠️</span>
        <p className="global-error-toast-message">{globalError}</p>
        <button className="global-error-toast-close" onClick={clearError} aria-label="Close error">
          &times;
        </button>
      </div>
    </div>
  );
};

export default GlobalErrorToast;
