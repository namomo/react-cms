import { AppConfig } from '../../../config/app-config';

const Footer = () => {
  if (!AppConfig.ui.showFooter) return null;

  return (
    <footer className="main-footer">
      <p>&copy; {new Date().getFullYear()} React CMS Base. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
