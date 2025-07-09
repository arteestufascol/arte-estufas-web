
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, Menu, X, LayoutDashboard } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCartStore";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, userProfile, signOut, loading } = useAuth();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!userProfile) return '/login';
    
    switch (userProfile.rol) {
      case 'admin':
        return '/dashboard/admin';
      case 'cliente':
        return '/dashboard/cliente';
      case 'usuario':
      default:
        return '/dashboard/usuario';
    }
  };

  const isDashboardRoute = location.pathname.startsWith('/dashboard/');
  const isUsuarioDashboard = location.pathname.startsWith('/dashboard/usuario');
  const isClienteDashboard = location.pathname.startsWith('/dashboard/cliente');

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Show main navigation for usuarios, clientes, and admin dashboards
  const showMainNavigation = !isDashboardRoute || isUsuarioDashboard || isClienteDashboard || location.pathname.startsWith('/dashboard/admin');

  return (
    <header className="bg-white shadow-sm border-b relative z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-arte-button rounded-full"></div>
            <span className="text-xl font-bold text-arte-title">Arte Estufas</span>
          </Link>

          {/* Desktop Navigation */}
          {showMainNavigation && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-arte-subtitle hover:text-arte-title transition-colors">
                Inicio
              </Link>
              <Link to="/catalogo/arteestufas" className="text-arte-subtitle hover:text-arte-title transition-colors">
                Catálogo
              </Link>
              <Link to="/acerca-de" className="text-arte-subtitle hover:text-arte-title transition-colors">
                Acerca de
              </Link>
              <Link to="/contacto" className="text-arte-subtitle hover:text-arte-title transition-colors">
                Contacto
              </Link>
              
              {/* Dashboard Button for authenticated users */}
              {user && userProfile && (
                <Link 
                  to={getDashboardPath()} 
                  className="flex items-center space-x-1 text-arte-button hover:text-arte-button-hover transition-colors font-medium"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Mi Dashboard</span>
                </Link>
              )}
            </nav>
          )}

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Menu Button */}
            {showMainNavigation && (
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            )}

            {/* Cart Button - for usuarios and clientes */}
            {(!isDashboardRoute || isUsuarioDashboard || isClienteDashboard) && (
              <Link to="/carrito" className="relative">
                <Button variant="outline" size="icon">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-arte-button text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-arte-button border-t-transparent"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userProfile?.nombre} {userProfile?.apellido}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {userProfile?.rol && (
                        <p className="text-xs leading-none text-muted-foreground capitalize">
                          Rol: {userProfile.rol}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardPath()} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Mi Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
                  <Link to="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMainNavigation && mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-40">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-arte-subtitle hover:text-arte-title transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Inicio
                </Link>
                <Link 
                  to="/catalogo/arteestufas" 
                  className="text-arte-subtitle hover:text-arte-title transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Catálogo
                </Link>
                <Link 
                  to="/acerca-de" 
                  className="text-arte-subtitle hover:text-arte-title transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Acerca de
                </Link>
                <Link 
                  to="/contacto" 
                  className="text-arte-subtitle hover:text-arte-title transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Contacto
                </Link>
                
                {/* Dashboard Button for mobile */}
                {user && userProfile && (
                  <Link 
                    to={getDashboardPath()} 
                    className="flex items-center space-x-2 text-arte-button hover:text-arte-button-hover transition-colors py-2 font-medium"
                    onClick={closeMobileMenu}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Mi Dashboard</span>
                  </Link>
                )}
                
                {!user && (
                  <div className="flex flex-col space-y-2 pt-2 border-t">
                    <Button variant="ghost" asChild className="justify-start">
                      <Link to="/login" onClick={closeMobileMenu}>Iniciar sesión</Link>
                    </Button>
                    <Button asChild className="justify-start">
                      <Link to="/register" onClick={closeMobileMenu}>Registrarse</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
