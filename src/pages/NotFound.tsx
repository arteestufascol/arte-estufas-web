
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-arte-card to-white px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-8xl font-bold text-arte-button mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-arte-title mb-4">
            Página no encontrada
          </h2>
          <p className="text-arte-subtitle">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <div className="space-y-4 animate-slide-in">
          <Button 
            asChild 
            className="bg-arte-button hover:bg-arte-button-hover text-white"
          >
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Ir al inicio
            </Link>
          </Button>
          
          <div>
            <Button 
              variant="outline" 
              asChild
              className="border-arte-button text-arte-button hover:bg-arte-card"
            >
              <Link to="/catalogo/arteestufas">
                Ver catálogo
              </Link>
            </Button>
          </div>
          
          <div className="pt-4">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-arte-subtitle hover:text-arte-button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver atrás
            </Button>
          </div>
        </div>
        
        <div className="mt-12 text-sm text-arte-subtitle">
          <p>¿Necesitas ayuda? <Link to="/contacto" className="text-arte-button hover:underline">Contáctanos</Link></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
