import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/auth-store';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <Link to="/" className="logo">
          <strong>React CMS Base</strong>
        </Link>
      </div>
      <div className="header-right">
        {user ? (
          <>
            <span className="user-info">안녕, {user.name} 님 ({user.role})</span>
            <Link to="/settings/profile" className="header-link">설정</Link>
            <button onClick={handleLogout} className="logout-button">로그아웃</button>
          </>
        ) : (
          <Link to="/login" className="header-link">로그인</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
