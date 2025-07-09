
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Mensaje enviado",
      description: "Te contactaremos pronto. ¡Gracias por escribirnos!",
    });

    // Reset form
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: ""
    });

    console.log("Contact form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-arte-title mb-6 animate-fade-in">
            Contáctanos
          </h1>
          <p className="text-xl text-arte-subtitle animate-fade-in">
            Estamos aquí para ayudarte con todas tus consultas sobre estufas y hornos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-lg animate-slide-in">
            <CardHeader>
              <CardTitle className="text-2xl text-arte-title">Envíanos un mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-arte-title">
                    Nombre completo *
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Tu nombre completo"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="border-arte-card focus:border-arte-button"
                    required
                  />
                </div>

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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-arte-title">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    placeholder="Tu número de teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="border-arte-card focus:border-arte-button"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensaje" className="text-arte-title">
                    Mensaje *
                  </Label>
                  <Textarea
                    id="mensaje"
                    name="mensaje"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="border-arte-card focus:border-arte-button h-32"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-arte-button hover:bg-arte-button-hover text-white"
                >
                  Enviar mensaje
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <MapPin className="h-6 w-6 text-arte-button" />
                  <div>
                    <h3 className="font-semibold text-arte-title">Dirección</h3>
                    <p className="text-arte-subtitle">
                      Calle 123 #45-67<br />
                      Bogotá, Colombia
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Phone className="h-6 w-6 text-arte-button" />
                  <div>
                    <h3 className="font-semibold text-arte-title">Teléfono</h3>
                    <p className="text-arte-subtitle">+57 300 123 4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Mail className="h-6 w-6 text-arte-button" />
                  <div>
                    <h3 className="font-semibold text-arte-title">Email</h3>
                    <p className="text-arte-subtitle">info@arteestufas.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Clock className="h-6 w-6 text-arte-button" />
                  <div>
                    <h3 className="font-semibold text-arte-title">Horario de atención</h3>
                    <div className="text-arte-subtitle">
                      <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                      <p>Sábados: 8:00 AM - 2:00 PM</p>
                      <p>Domingos: Cerrado</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-arte-card">
              <CardContent className="p-6">
                <h3 className="font-semibold text-arte-title mb-3">¿Necesitas una cotización?</h3>
                <p className="text-arte-subtitle text-sm mb-4">
                  Si tienes un proyecto específico en mente, visita nuestro catálogo 
                  y solicita una cotización personalizada.
                </p>
                <Button 
                  asChild
                  className="bg-arte-button hover:bg-arte-button-hover text-white"
                >
                  <a href="/catalogo/arteestufas">Ver catálogo</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
