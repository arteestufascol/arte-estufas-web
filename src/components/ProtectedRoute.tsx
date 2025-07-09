
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - User:', user?.email || 'No user', 'Profile:', userProfile?.rol || 'No profile', 'Loading:', loading);

  // Show loading while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-arte-bg">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arte-button mx-auto mb-4"></div>
            <p className="text-arte-subtitle">Verificando permisos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show loading if user exists but profile is still loading
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-arte-bg">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arte-button mx-auto mb-4"></div>
            <p className="text-arte-subtitle">Cargando información del usuario...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user role is allowed
  if (!allowedRoles.includes(userProfile.rol)) {
    console.log('User role not allowed:', userProfile.rol, 'Required:', allowedRoles);
    return <Navigate 
      to="/error" 
      state={{ 
        message: `No tienes permisos para acceder a esta sección. Tu rol actual es: ${userProfile.rol}`,
        type: "unauthorized"
      }} 
      replace 
    />;
  }

  console.log('Access granted for user with role:', userProfile.rol);
  return <>{children}</>;
};

export default ProtectedRoute;
