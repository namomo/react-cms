import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const menuData = [
  { title: '대시보드', path: '/' },
  {
    title: '설정',
    children: [
      { title: '사용자 정보', path: '/settings/profile' },
      { title: '권한 관리', path: '/settings/permissions' },
    ]
  },
  {
    title: '콘텐츠',
    children: [
      { title: '아이템 관리', path: '/content/items' },
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  // 라우팅 경로가 변경될 때마다 해당하는 메뉴를 열어줍니다.
  useEffect(() => {
    const currentPath = location.pathname;

    setOpenMenus(prev => {
      const next = { ...prev };
      menuData.forEach(menu => {
        if (menu.children) {
          const hasActiveChild = menu.children.some(
            child => currentPath === child.path || currentPath.startsWith(`${child.path}/`)
          );
          if (hasActiveChild) {
            next[menu.title] = true;
          }
        }
      });
      return next;
    });
  }, [location.pathname]);

  const toggleMenu = (title) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuData.map((menu) => {
            // 하위 메뉴가 있는 경우 (아코디언 형태)
            if (menu.children) {
              const isOpen = openMenus[menu.title];
              return (
                <li key={menu.title} style={{ marginBottom: '15px' }}>
                  <div
                    onClick={() => toggleMenu(menu.title)}
                    style={{
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{menu.title}</span>
                    <span style={{ fontSize: '0.8em', color: '#666' }}>{isOpen ? '▼' : '▶'}</span>
                  </div>
                  {isOpen && (
                    <ul style={{ paddingLeft: '15px', marginTop: '8px', listStyle: 'none' }}>
                      {menu.children.map((child) => (
                        <li key={child.path} style={{ marginBottom: '8px' }}>
                          <NavLink
                            to={child.path}
                            style={({ isActive }) => ({
                              textDecoration: 'none',
                              color: isActive ? '#007bff' : '#333',
                              fontWeight: isActive ? 'bold' : 'normal',
                              display: 'block'
                            })}
                          >
                            {child.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            // 단일 메뉴인 경우
            return (
              <li key={menu.path} style={{ marginBottom: '15px' }}>
                <NavLink
                  to={menu.path}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive ? '#007bff' : '#333',
                    fontWeight: isActive ? 'bold' : 'normal',
                    display: 'block'
                  })}
                >
                  {menu.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
