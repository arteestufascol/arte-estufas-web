
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

const Error = () => {
  const location = useLocation();
  const errorMessage = location.state?.message || "Ha ocurrido un error inesperado.";
  const errorType = location.state?.type || "error";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-arte-card to-white px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-arte-title">
            {errorType === 'unauthorized' ? 'Acceso No Autorizado' : 'Error'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-arte-subtitle">
            {errorMessage}
          </p>
          
          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full bg-arte-button hover:bg-arte-button-hover text-white"
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Ir al inicio
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              asChild
              className="w-full border-arte-button text-arte-button hover:bg-arte-card"
            >
              <Link to="/login">
                Iniciar sesión
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="w-full text-arte-subtitle hover:text-arte-button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver atrás
            </Button>
          </div>
          
          <div className="pt-4 text-sm text-arte-subtitle">
            <p>¿Necesitas ayuda? <Link to="/contacto" className="text-arte-button hover:underline">Contáctanos</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Error;
