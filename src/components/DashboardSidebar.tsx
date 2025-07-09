
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Plus, 
  Edit, 
  FileText, 
  Briefcase, 
  Users, 
  User, 
  LogOut, 
  Menu, 
  X,
  Percent
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  userRole: 'admin' | 'cliente' | 'usuario';
}

const DashboardSidebar = ({ userRole }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { userProfile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close sidebar on window resize if it becomes desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const baseClass = "flex items-center gap-3 px-3 py-3 text-[#4E3B31] hover:bg-[#A0522D] hover:text-white transition-colors duration-200 rounded-lg mx-2 text-sm font-medium";
  const activeClass = "bg-[#A0522D] text-white";

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            icon: <Home size={18} />,
            label: 'Inicio del panel',
            path: '/dashboard/admin',
            exact: true
          },
          {
            icon: <Plus size={18} />,
            label: 'Crear producto',
            path: '/dashboard/admin/producto'
          },
          {
            icon: <Edit size={18} />,
            label: 'Editar producto',
            path: '/dashboard/admin/editar-producto'
          },
          {
            icon: <FileText size={18} />,
            label: 'Cotizaciones',
            path: '/dashboard/admin/cotizaciones'
          },
          {
            icon: <Briefcase size={18} />,
            label: 'Trabajos contratados',
            path: '/dashboard/admin/trabajos'
          },
          {
            icon: <Users size={18} />,
            label: 'Gestión de usuarios',
            path: '/dashboard/admin/usuarios'
          },
          {
            icon: <Percent size={18} />,
            label: 'Cupones de descuento',
            path: '/dashboard/admin/cupones'
          }
        ];

      case 'cliente':
        return [
          {
            icon: <Home size={18} />,
            label: 'Inicio del cliente',
            path: '/dashboard/cliente',
            exact: true
          },
          {
            icon: <FileText size={18} />,
            label: 'Mis cotizaciones',
            path: '/dashboard/cliente/mis-cotizaciones'
          },
          {
            icon: <Briefcase size={18} />,
            label: 'Servicios contratados',
            path: '/dashboard/cliente/servicios-contratados'
          },
          {
            icon: <User size={18} />,
            label: 'Mi perfil',
            path: '/dashboard/cliente/mi-perfil'
          }
        ];

      case 'usuario':
      default:
        return [
          {
            icon: <Home size={18} />,
            label: 'Inicio del usuario',
            path: '/dashboard/usuario',
            exact: true
          },
          {
            icon: <FileText size={18} />,
            label: 'Mis cotizaciones',
            path: '/dashboard/usuario/mis-cotizaciones'
          },
          {
            icon: <User size={18} />,
            label: 'Mi perfil',
            path: '/dashboard/usuario/mi-perfil'
          }
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile hamburger button - Fixed position */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="icon"
          className="bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-[#D8CFC4] transform transition-transform duration-300 ease-in-out z-50 shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:shadow-none
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-[#A0522D]/20 bg-[#D8CFC4]">
            <div className="text-center">
              <Link to="/" className="inline-block">
                <h1 className="text-lg lg:text-xl font-bold text-[#4E3B31] mb-2">Arte Estufas</h1>
              </Link>
              {userProfile && (
                <div className="text-xs lg:text-sm text-[#4E3B31]/80">
                  <p className="font-medium truncate">{userProfile.nombre} {userProfile.apellido}</p>
                  <p className="text-xs uppercase tracking-wide">
                    {userProfile.rol}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 py-2 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                const isActive = item.exact 
                  ? location.pathname === item.path
                  : isActiveRoute(item.path);
                
                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      onClick={closeSidebar}
                      className={`${baseClass} ${isActive ? activeClass : ''}`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="truncate text-xs lg:text-sm">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-[#A0522D]/20 bg-[#D8CFC4]">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-3 text-[#4E3B31] hover:bg-red-500 hover:text-white transition-colors duration-200 rounded-lg w-full text-xs lg:text-sm font-medium"
            >
              <LogOut size={18} className="flex-shrink-0" />
              <span className="truncate">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
