import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/auth-store';
import { authService } from '../../../services/auth-service';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const loginAction = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Service 모듈을 통한 API 호출 (내부적으로 Mock/Real 제어 배포)
      const response = await authService.login(username, password);

      if (response.success) {
        // 로그인 성공 시 가져온 유저 정보와 토큰, 권한 정보를 Store로 넘김
        loginAction(response.data.user, response.data.token, response.data.permissions || []);

        // 로그인 성공 시 대시보드로 리다이렉트
        navigate('/', { replace: true });
      } else {
        setError('로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '300px', width: '100%' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Login</h2>
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username (아무거나)"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (아무거나)"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px', marginTop: '10px' }}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
