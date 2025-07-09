
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, loading, user, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect authenticated users
  useEffect(() => {
    if (user && userProfile) {
      console.log('User authenticated, redirecting to dashboard');
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
          navigate('/', { replace: true });
          break;
      }
    }
  }, [user, userProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email válido",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (!error) {
        console.log('Login successful, redirect will be handled by useEffect');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-arte-bg">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arte-button mx-auto mb-4"></div>
            <p className="text-arte-subtitle">Verificando sesión...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-arte-bg">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-arte-title">Iniciar sesión</CardTitle>
          <CardDescription className="text-arte-subtitle">
            Ingresa a tu cuenta de Arte Estufas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-arte-title">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className="border-arte-card focus:border-arte-button"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-arte-title">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
                className="border-arte-card focus:border-arte-button"
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-arte-button hover:bg-arte-button-hover text-white"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-arte-subtitle">
                ¿No tienes cuenta?{" "}
                <Link 
                  to="/register" 
                  className="text-arte-button hover:underline font-medium"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
