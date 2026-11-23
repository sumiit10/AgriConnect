import { Link } from 'react-router-dom';
export default function Footer() {
  return <footer className="site-footer"><div className="container footer-grid">
    <div><Link to="/" className="brand footer-brand">🌾 AgriConnect</Link><p>Helping farmers share resources and find the equipment they need.</p></div>
    <div><strong>Explore</strong><Link to="/equipment">Browse equipment</Link><Link to="/register">Join the community</Link></div>
    <div><strong>Account</strong><Link to="/login">Log in</Link><Link to="/rentals">My rentals</Link></div>
  </div><div className="footer-bottom">© {new Date().getFullYear()} AgriConnect · Academic project</div></footer>;
}
