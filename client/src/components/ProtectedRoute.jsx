import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from './Loader.jsx';

export default function ProtectedRoute({ ownerOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader text="Checking your account..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (ownerOnly && user.role !== 'owner') return <Navigate to="/equipment" replace />;
  return <Outlet />;
}
