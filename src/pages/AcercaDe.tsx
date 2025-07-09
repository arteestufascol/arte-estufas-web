
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Heart, Award, Users } from "lucide-react";

const AcercaDe = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-arte-title mb-6 animate-fade-in">
            Acerca de Arte Estufas
          </h1>
          <p className="text-xl text-arte-subtitle animate-fade-in">
            Más de una década creando calor y momentos especiales para tu hogar
          </p>
        </div>

        {/* Historia */}
        <Card className="mb-8 shadow-lg animate-slide-in">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-arte-title mb-4">Nuestra Historia</h2>
            <p className="text-arte-subtitle leading-relaxed mb-4">
              Arte Estufas Rasmir 
            </p>
            <p className="text-arte-subtitle leading-relaxed">
              A lo largo de los años, hemos perfeccionado nuestras técnicas y expandido 
              nuestra línea de productos, pero mantenemos el mismo compromiso con la calidad 
              artesanal y el servicio personalizado que nos caracterizó desde el inicio.
            </p>
          </CardContent>
        </Card>

        {/* Valores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 text-center">
              <Flame className="h-12 w-12 text-arte-button mx-auto mb-4" />
              <h3 className="text-xl font-bold text-arte-title mb-3">Pasión por la Calidad</h3>
              <p className="text-arte-subtitle">
                Cada producto es fabricado con los mejores materiales y técnicas 
                artesanales tradicionales.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-arte-button mx-auto mb-4" />
              <h3 className="text-xl font-bold text-arte-title mb-3">Compromiso Familiar</h3>
              <p className="text-arte-subtitle">
                Entendemos la importancia del hogar y trabajamos para crear 
                espacios de encuentro y calidez.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-arte-button mx-auto mb-4" />
              <h3 className="text-xl font-bold text-arte-title mb-3">Excelencia Artesanal</h3>
              <p className="text-arte-subtitle">
                Combinamos técnicas tradicionales con innovación para crear 
                productos únicos y duraderos.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-arte-button mx-auto mb-4" />
              <h3 className="text-xl font-bold text-arte-title mb-3">Servicio Personalizado</h3>
              <p className="text-arte-subtitle">
                Te acompañamos desde la selección hasta la instalación, 
                brindando asesoría experta en cada paso.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-arte-title mb-4">Nuestra Misión</h2>
              <p className="text-arte-subtitle leading-relaxed">
                Crear estufas de leña y hornos artesanales de la más alta calidad, 
                que no solo brinden calor eficiente sino que también se conviertan 
                en el corazón del hogar, fomentando momentos de encuentro familiar 
                y creando recuerdos inolvidables.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-arte-title mb-4">Nuestra Visión</h2>
              <p className="text-arte-subtitle leading-relaxed">
                Ser reconocidos como la empresa líder en Colombia en la fabricación 
                de estufas de leña artesanales, expandiendo nuestra presencia a nivel 
                nacional e internacional, siempre manteniendo nuestro compromiso con 
                la calidad y el arte tradicional.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AcercaDe;
