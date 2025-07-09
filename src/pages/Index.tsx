
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Flame, Shield, Heart, Star, Truck, Users } from "lucide-react";

const Index = () => {
  const benefits = [
    {
      icon: <Flame className="h-8 w-8 text-arte-button" />,
      title: "Calor Natural",
      description: "Disfruta del calor auténtico y acogedor que solo la leña puede brindar, creando un ambiente único en tu hogar."
    },
    {
      icon: <Shield className="h-8 w-8 text-arte-button" />,
      title: "Eficiencia Energética",
      description: "Ahorra en costos de calefacción con nuestras estufas de alta eficiencia que aprovechan al máximo cada tronco."
    },
    {
      icon: <Heart className="h-8 w-8 text-arte-button" />,
      title: "Ambiente Familiar",
      description: "Crea momentos especiales alrededor del fuego, convirtiendo tu hogar en el centro de reunión familiar."
    }
  ];

  const whyChooseUs = [
    {
      icon: <Star className="h-6 w-6 text-arte-button" />,
      title: "Calidad Premium",
      description: "Productos fabricados con los mejores materiales y acabados artesanales."
    },
    {
      icon: <Truck className="h-6 w-6 text-arte-button" />,
      title: "Envío Seguro",
      description: "Entregamos tu estufa con el máximo cuidado y puntualidad."
    },
    {
      icon: <Users className="h-6 w-6 text-arte-button" />,
      title: "Asesoría Experta",
      description: "Te acompañamos en todo el proceso, desde la elección hasta la instalación."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-arte-card to-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-arte-title mb-6 animate-fade-in">
            Tienda online de cotizaciones
            <br />
            <span className="text-arte-button">Arte Estufas Rasmir</span>
          </h1>
          <p className="text-xl text-arte-subtitle mb-8 max-w-2xl mx-auto animate-fade-in">
            Descubre nuestra colección exclusiva de estufas de leña y hornos artesanales. 
            Calidad, diseño y calidez para transformar tu hogar.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-arte-button hover:bg-arte-button-hover text-white text-lg px-8 py-4 animate-fade-in"
          >
            <Link to="/catalogo/arteestufas">Ver catálogo</Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-arte-title text-center mb-12">
            Ventajas de tener una estufa de leña
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="bg-arte-card border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-arte-title mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-arte-subtitle leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-arte-title text-center mb-12">
            ¿Por qué comprar con nosotros?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-lg hover:bg-arte-card transition-colors duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-arte-title mb-2">
                  {item.title}
                </h3>
                <p className="text-arte-subtitle text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-arte-button to-arte-button-hover">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in">
            ¿Listo para realizar una compra con nosotros?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
            Explora nuestro catálogo completo y encuentra la estufa perfecta para tu hogar. 
            Obtén cotizaciones personalizadas y asesoría experta.
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
            className="bg-white text-arte-button hover:bg-gray-100 text-lg px-8 py-4 animate-fade-in"
          >
            <Link to="/catalogo/arteestufas">Explorar productos</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
