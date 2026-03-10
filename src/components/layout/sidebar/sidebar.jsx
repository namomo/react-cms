import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">대시보드</Link></li>
          <li>
            <span>설정</span>
            <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
              <li><Link to="/settings/profile">사용자 정보</Link></li>
              <li><Link to="/settings/permissions">권한 관리</Link></li>
            </ul>
          </li>
          <li style={{ marginTop: '10px' }}>
            <span>콘텐츠</span>
            <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
              <li><Link to="/content/items">아이템 관리</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
