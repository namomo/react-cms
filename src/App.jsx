import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/app-router';
import useAuthStore from './stores/auth-store';
import GlobalErrorToast from './components/common/global-error-toast/global-error-toast';

function App() {
  const { isInitialized, verifyAuth } = useAuthStore();

  useEffect(() => {
    // 앱이 처음 구동될 때 (새로고침 등) 스토리지의 토큰 유효성을 검사합니다.
    verifyAuth();
  }, [verifyAuth]);

  // 서버로부터 토큰이 유효한지 검사하는 동안에는 빈 화면(혹은 로딩)을 보여줍니다.
  // 이 처리가 없으면 잠깐 깜빡거리며 원치 않은 페이지가 노출될 수 있습니다.
  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <h2>인증 정보를 확인하는 중입니다...</h2>
      </div>
    );
  }

  // 검증이 끝나면 정상적으로 라우터를 그리며, 
  // 내부의 ProtectedRoute 로직에 따라 login 화면으로 갈지 보호된 화면으로 갈지 결정됩니다.
  return (
    <>
      <RouterProvider router={router} />
      <GlobalErrorToast />
    </>
  );
}

export default App;
