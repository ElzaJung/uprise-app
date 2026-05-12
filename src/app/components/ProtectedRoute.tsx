import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    console.log("ProtectedRoute: Loading auth state...");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!user) {
    console.log("ProtectedRoute: No user found, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log(`ProtectedRoute: User authenticated - ${user.email}`);
  return <>{children}</>;
}
