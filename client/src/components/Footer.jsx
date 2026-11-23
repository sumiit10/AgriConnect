import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
export default function Footer() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  return <footer className="site-footer"><div className="container footer-grid">
    <div><Link to="/" className="brand footer-brand">🌾 AgriConnect</Link><p>{language === 'mr' ? 'शेतकऱ्यांना संसाधने शेअर करण्यास आणि आवश्यक उपकरणे शोधण्यास मदत.' : 'Helping farmers share resources and find the equipment they need.'}</p></div>
    <div><strong>{language === 'mr' ? 'एक्सप्लोर करा' : 'Explore'}</strong><Link to="/equipment">{t('browse')}</Link><Link to="/register">{language === 'mr' ? 'समुदायात सामील व्हा' : 'Join the community'}</Link></div>
    <div><strong>{language === 'mr' ? 'खाते' : 'Account'}</strong>{!user && <Link to="/login">{t('login')}</Link>}{user && <Link to="/profile">{t('profile')}</Link>}<Link to="/rentals">{t('myRentals')}</Link></div>
  </div><div className="footer-bottom">© {new Date().getFullYear()} AgriConnect · {language === 'mr' ? 'शैक्षणिक प्रकल्प' : 'Academic project'}</div></footer>;
}
