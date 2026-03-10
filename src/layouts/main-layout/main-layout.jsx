import { Outlet } from 'react-router-dom';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import Sidebar from '../../components/layout/sidebar/sidebar';

const MainLayout = () => {
  return (
    <div className="main-layout-wrapper">
      <Header />
      <div className="main-body">
        <Sidebar />
        <main className="main-content-wrapper">
          <div className="content-area">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
