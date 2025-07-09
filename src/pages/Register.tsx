import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "CC",
    cedula: "",
    direccion: "",
    pais: "",
    departamento: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const tiposDocumento = [
    { value: "CC", label: "Cédula de Ciudadanía" },
    { value: "TI", label: "Tarjeta de Identidad" },
    { value: "CE", label: "Cédula de Extranjería" },
    { value: "PASAPORTE", label: "Pasaporte" }
  ];

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

  const validateForm = () => {
    // Required fields validation
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.apellido.trim()) {
      toast({
        title: "Error",
        description: "El apellido es obligatorio",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.cedula.trim()) {
      toast({
        title: "Error",
        description: "El número de documento es obligatorio",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "El correo electrónico es obligatorio",
        variant: "destructive"
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email válido",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.password) {
      toast({
        title: "Error",
        description: "La contraseña es obligatoria",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const userData = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      tipo_documento: formData.tipoDocumento,
      cedula: formData.cedula.trim(),
      direccion: formData.direccion.trim(),
      pais: formData.pais.trim(),
      departamento: formData.departamento.trim(),
      telefono: formData.telefono.trim()
    };

    console.log('Sending user data:', userData);

    try {
      const { error } = await signUp(formData.email.trim(), formData.password, userData);
      
      if (!error) {
        // Clear form
        setFormData({
          nombre: "",
          apellido: "",
          tipoDocumento: "CC",
          cedula: "",
          direccion: "",
          pais: "",
          departamento: "",
          telefono: "",
          email: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false
        });
        
        // Navigate to login after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
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

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-arte-title">Crear cuenta</CardTitle>
          <CardDescription className="text-arte-subtitle">
            Únete a la familia Arte Estufas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-arte-title">
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="border-arte-card focus:border-arte-button"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido" className="text-arte-title">
                  Apellido *
                </Label>
                <Input
                  id="apellido"
                  name="apellido"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="border-arte-card focus:border-arte-button"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Documento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-arte-title">Tipo de documento *</Label>
                <Select 
                  value={formData.tipoDocumento}
                  onValueChange={(value) => handleSelectChange("tipoDocumento", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-arte-card focus:border-arte-button">
                    <SelectValue placeholder="Selecciona tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDocumento.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cedula" className="text-arte-title">
                  Número de documento *
                </Label>
                <Input
                  id="cedula"
                  name="cedula"
                  placeholder="Número de documento"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="border-arte-card focus:border-arte-button"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-arte-title">
                Correo electrónico *
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

            {/* Ubicación */}
            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-arte-title">
                Dirección
              </Label>
              <Input
                id="direccion"
                name="direccion"
                placeholder="Tu dirección completa"
                value={formData.direccion}
                onChange={handleChange}
                className="border-arte-card focus:border-arte-button"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pais" className="text-arte-title">
                  País
                </Label>
                <Input
                  id="pais"
                  name="pais"
                  placeholder="País"
                  value={formData.pais}
                  onChange={handleChange}
                  className="border-arte-card focus:border-arte-button"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento" className="text-arte-title">
                  Departamento/Estado
                </Label>
                <Input
                  id="departamento"
                  name="departamento"
                  placeholder="Departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  className="border-arte-card focus:border-arte-button"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-arte-title">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  name="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="border-arte-card focus:border-arte-button"
                />
              </div>
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-arte-title">
                  Contraseña *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Tu contraseña (mín. 6 caracteres)"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-arte-card focus:border-arte-button"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-arte-title">
                  Confirmar contraseña *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-arte-card focus:border-arte-button"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData({...formData, acceptTerms: checked as boolean})}
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-sm text-arte-subtitle">
                Acepto los{" "}
                <Link to="/terminos-uso" className="text-arte-button hover:underline">
                  términos y condiciones
                </Link>
                {" "}y la{" "}
                <Link to="/politica-privacidad" className="text-arte-button hover:underline">
                  política de privacidad
                </Link>
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-arte-button hover:bg-arte-button-hover text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-arte-subtitle">
                ¿Ya tienes cuenta?{" "}
                <Link 
                  to="/login" 
                  className="text-arte-button hover:underline font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
