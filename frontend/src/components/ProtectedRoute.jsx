import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context';

export default function ProtectedRoute({ allowedRoles }) {
  const { loading, user, profile } = useAuth();
  const location = useLocation();
  if (loading) return <div className="center-card">Loading session…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (allowedRoles && !allowedRoles.includes(profile?.role)) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
