import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/equipment" className={linkClass} onClick={() => setOpen(false)}>Browse equipment</NavLink>
          {user?.role === 'owner' && <NavLink to="/owner/equipment" className={linkClass} onClick={() => setOpen(false)}>My equipment</NavLink>}
          {user && <NavLink to="/rentals" className={linkClass} onClick={() => setOpen(false)}>My rentals</NavLink>}
          {user && <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>Profile</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? <>
            <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
            <button className="button button-outline button-small" onClick={handleLogout}>Log out</button>
          </> : <>
            <Link className="button button-ghost button-small" to="/login">Log in</Link>
            <Link className="button button-primary button-small" to="/register">Create account</Link>
          </>}
        </div>
      </div>
    </header>
  );
}
