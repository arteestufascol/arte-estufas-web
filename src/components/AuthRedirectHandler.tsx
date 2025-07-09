
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AuthRedirectHandler = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);
  const redirectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset redirect flag when user changes
    if (!user) {
      hasRedirected.current = false;
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
        redirectTimeout.current = null;
      }
    }
  }, [user]);

  useEffect(() => {
    // Don't redirect if still loading or already redirected
    if (loading || hasRedirected.current) return;

    const currentPath = location.pathname;
    console.log('AuthRedirectHandler - Current path:', currentPath, 'User:', user?.email, 'Profile:', userProfile?.rol);

    // Clear any existing timeout
    if (redirectTimeout.current) {
      clearTimeout(redirectTimeout.current);
    }

    // Handle authenticated users with profiles
    if (user && userProfile) {
      const isAuthPage = currentPath === '/login' || currentPath === '/register';
      const isHomePage = currentPath === '/';
      const isCorrectDashboard = 
        (userProfile.rol === 'admin' && currentPath.startsWith('/dashboard/admin')) ||
        (userProfile.rol === 'cliente' && currentPath.startsWith('/dashboard/cliente')) ||
        (userProfile.rol === 'usuario' && currentPath.startsWith('/dashboard/usuario'));

      // Only redirect from auth pages, not from home or other public pages
      if (isAuthPage && !hasRedirected.current) {
        console.log('Redirecting authenticated user from auth page, role:', userProfile.rol);
        hasRedirected.current = true;
        
        redirectTimeout.current = setTimeout(() => {
          switch (userProfile.rol) {
            case 'admin':
              navigate('/dashboard/admin', { replace: true });
              break;
            case 'cliente':
              navigate('/dashboard/cliente', { replace: true });
              break;
            case 'usuario':
              navigate('/dashboard/usuario', { replace: true });
              break;
            default:
              console.log('Unknown role, staying on current page:', userProfile.rol);
              break;
          }
        }, 100);
      }
      
      // Redirect if user is on wrong dashboard
      if (currentPath.startsWith('/dashboard/') && !isCorrectDashboard && !hasRedirected.current) {
        console.log('Redirecting user to correct dashboard, role:', userProfile.rol);
        hasRedirected.current = true;
        
        redirectTimeout.current = setTimeout(() => {
          switch (userProfile.rol) {
            case 'admin':
              navigate('/dashboard/admin', { replace: true });
              break;
            case 'cliente':
              navigate('/dashboard/cliente', { replace: true });
              break;
            case 'usuario':
              navigate('/dashboard/usuario', { replace: true });
              break;
            default:
              navigate('/error', { 
                state: { 
                  message: 'Rol de usuario no reconocido. Por favor, contacta al administrador.',
                  type: 'error'
                },
                replace: true 
              });
              break;
          }
        }, 100);
      }
    }

    // Handle authenticated users without profile (wait a bit for profile to load)
    if (user && !userProfile && !loading) {
      redirectTimeout.current = setTimeout(() => {
        if (user && !userProfile && !hasRedirected.current) {
          console.log('User authenticated but no profile found after timeout');
          hasRedirected.current = true;
          navigate('/error', { 
            state: { 
              message: 'No se pudo cargar la información del usuario. Por favor, inicia sesión nuevamente.',
              type: 'error'
            },
            replace: true 
          });
        }
      }, 5000); // Wait 5 seconds for profile to load
    }

    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, [user, userProfile, loading, navigate, location.pathname]);

  return null;
};

export default AuthRedirectHandler;
