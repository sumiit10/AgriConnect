import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate('/');
  }

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link to="/" className="brand"><span className="brand-mark">🌾</span><span>Agri<span>Connect</span></span></Link>
        <button className="mobile-menu" onClick={() => setOpen(v => !v)} aria-label="Toggle navigation">☰</button>
        <nav className={`nav-links ${open ? 'nav-open' : ''}`}>
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>{t('home')}</NavLink>
          <NavLink to="/equipment" className={linkClass} onClick={() => setOpen(false)}>{t('browse')}</NavLink>
          {user?.role === 'owner' && <NavLink to="/owner/equipment" className={linkClass} onClick={() => setOpen(false)}>{t('myEquipment')}</NavLink>}
          {user && <NavLink to="/rentals" className={linkClass} onClick={() => setOpen(false)}>{t('myRentals')}</NavLink>}
          {user && <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>{t('profile')}</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? <>
            <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
            <button className="button button-outline button-small" onClick={handleLogout}>{t('logout')}</button>
          </> : <>
            <Link className="button button-ghost button-small" to="/login">{t('login')}</Link>
            <Link className="button button-primary button-small" to="/register">{t('createAccount')}</Link>
          </>}
          <label className="language-switcher"><span className="sr-only">{t('language')}</span><select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t('language')}><option value="mr">मराठी</option><option value="en">English</option></select></label>
        </div>
      </div>
    </header>
  );
}
