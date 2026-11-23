import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
export default function AppLayout() {
  return <><Navbar /><main className="main-content"><Outlet /></main><Footer /></>;
}
