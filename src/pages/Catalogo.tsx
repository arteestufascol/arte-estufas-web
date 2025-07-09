
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/hooks/useCartStore";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  codigo_referencia: string;
  materiales: string;
  tamano: string;
  capacidad: string;
  precio: number | null;
  preguntar_cotizacion: boolean;
  foto_url: string;
}

const Catalogo = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCartStore();

  const { data: productos = [], isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (error) {
        console.error('Error fetching productos:', error);
        throw error;
      }

      return data as Producto[];
    }
  });

  const handleAddToCart = (producto: Producto) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito",
        variant: "destructive",
      });
      return;
    }

    addToCart(producto);
    toast({
      title: "Producto agregado",
      description: `${producto.nombre} se agregó a tu carrito`,
    });
  };

  const handleCotizacion = (producto: Producto) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para solicitar cotizaciones",
        variant: "destructive",
      });
      return;
    }

    addToCart(producto);
    toast({
      title: "Producto agregado para cotización",
      description: `${producto.nombre} se agregó a tu carrito para cotizar`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-arte-bg">
        <div className="container mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-arte-button mx-auto mb-4"></div>
          <p className="text-arte-subtitle">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-arte-bg">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-arte-title mb-4 animate-fade-in">
            Catálogo Arte Estufas
          </h1>
          <p className="text-xl text-arte-subtitle max-w-2xl mx-auto animate-fade-in">
            Descubre nuestra selección de estufas de leña y hornos artesanales, 
            diseñados para brindar calidez y estilo a tu hogar.
          </p>
        </div>

        {/* Products Grid */}
        {productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((producto, index) => (
              <Card 
                key={producto.id} 
                className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-in bg-arte-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img 
                    src={producto.foto_url || "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&h=400&fit=crop"} 
                    alt={producto.nombre}
                    className="w-full h-64 object-cover"
                  />
                  {producto.preguntar_cotizacion && (
                    <Badge className="absolute top-4 right-4 bg-arte-button text-white">
                      Cotización
                    </Badge>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-arte-title">{producto.nombre}</CardTitle>
                  <Badge variant="outline" className="w-fit text-xs">
                    Código: {producto.codigo_referencia}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-arte-subtitle text-sm">
                    {producto.descripcion}
                  </p>

                  <div className="space-y-2 text-sm">
                    {producto.materiales && (
                      <div>
                        <span className="font-semibold text-arte-title">Materiales:</span>
                        <p className="text-arte-subtitle">{producto.materiales}</p>
                      </div>
                    )}
                    {producto.tamano && (
                      <div>
                        <span className="font-semibold text-arte-title">Tamaño:</span>
                        <p className="text-arte-subtitle">{producto.tamano}</p>
                      </div>
                    )}
                    {producto.capacidad && (
                      <div>
                        <span className="font-semibold text-arte-title">Capacidad:</span>
                        <p className="text-arte-subtitle">{producto.capacidad}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    {producto.preguntar_cotizacion || !producto.precio ? (
                      <div className="space-y-3">
                        <p className="text-lg font-bold text-arte-button text-center">
                          Preguntar cotización
                        </p>
                        <Button 
                          onClick={() => handleCotizacion(producto)}
                          className="w-full bg-arte-button hover:bg-arte-button-hover text-white"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Agregar para cotizar
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-2xl font-bold text-arte-button text-center">
                          {formatPrice(producto.precio)}
                        </p>
                        <Button 
                          onClick={() => handleAddToCart(producto)}
                          className="w-full bg-arte-button hover:bg-arte-button-hover text-white"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Agregar al carrito
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-arte-subtitle">
              No hay productos disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogo;
