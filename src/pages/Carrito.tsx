
import React, { useState } from 'react';
import { useCartStore } from '@/hooks/useCartStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CotizacionFormComponent from '@/components/CotizacionForm';
import DiscountCodeForm from '@/components/DiscountCodeForm';

const Carrito = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems } = useCartStore();
  const { toast } = useToast();
  const [showCotizacionForm, setShowCotizacionForm] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percentage: number } | null>(null);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setAppliedDiscount(null);
    toast({
      title: "Carrito vaciado",
      description: "Todos los elementos han sido eliminados del carrito"
    });
  };

  const handleApplyDiscount = (percentage: number, code: string) => {
    setAppliedDiscount({ code, percentage });
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
  };

  const totalItems = getTotalItems();
  const subtotal = items.reduce((sum, item) => {
    if (item.precio && !item.preguntar_cotizacion) {
      return sum + (item.precio * item.quantity);
    }
    return sum;
  }, 0);

  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0;
  const totalPrice = subtotal - discountAmount;

  if (showCotizacionForm) {
    return (
      <div className="min-h-screen bg-arte-bg py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <CotizacionFormComponent
            onSuccess={() => setShowCotizacionForm(false)}
            onCancel={() => setShowCotizacionForm(false)}
          />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-arte-bg py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-arte-title mb-2">Tu carrito está vacío</h2>
            <p className="text-arte-subtitle mb-6">Agrega algunos productos para continuar</p>
            <Button 
              onClick={() => window.location.href = '/catalogo/arteestufas'}
              className="bg-arte-button hover:bg-arte-button/90"
            >
              Ver Catálogo Arte Estufas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-arte-bg py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-arte-title mb-2">
            Carrito de Compras
          </h1>
          <p className="text-sm sm:text-base text-arte-subtitle">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Imagen del producto */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0">
                      {item.foto_url ? (
                        <img 
                          src={item.foto_url} 
                          alt={item.nombre}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs sm:text-sm">Sin imagen</span>
                        </div>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-arte-title text-base sm:text-lg truncate">
                            {item.nombre}
                          </h3>
                          <p className="text-xs sm:text-sm text-arte-subtitle">
                            Código: {item.codigo_referencia}
                          </p>
                          {item.descripcion && (
                            <p className="text-xs sm:text-sm text-arte-subtitle mt-1 line-clamp-2">
                              {item.descripcion}
                            </p>
                          )}
                          <div className="mt-2 space-y-1">
                            {item.materiales && (
                              <p className="text-xs text-arte-subtitle">
                                <span className="font-medium">Materiales:</span> {item.materiales}
                              </p>
                            )}
                            {item.tamano && (
                              <p className="text-xs text-arte-subtitle">
                                <span className="font-medium">Tamaño:</span> {item.tamano}
                              </p>
                            )}
                            {item.capacidad && (
                              <p className="text-xs text-arte-subtitle">
                                <span className="font-medium">Capacidad:</span> {item.capacidad}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2 sm:gap-3">
                          {/* Precio */}
                          <div className="text-right">
                            {item.preguntar_cotizacion ? (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
                                Cotización
                              </span>
                            ) : (
                              <p className="text-lg sm:text-xl font-bold text-green-600">
                                ${item.precio?.toFixed(2)}
                              </p>
                            )}
                          </div>

                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 h-8 text-center text-sm"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Botón eliminar */}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="w-full sm:w-auto"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumen del carrito */}
          <div className="lg:col-span-1 space-y-4">
            {/* Código de descuento */}
            <DiscountCodeForm
              onApplyDiscount={handleApplyDiscount}
              appliedDiscount={appliedDiscount}
              onRemoveDiscount={handleRemoveDiscount}
            />

            {/* Resumen */}
            <Card className="shadow-lg sticky top-4">
              <CardHeader>
                <CardTitle className="text-arte-title">Resumen del Carrito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total de productos:</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Productos con precio:</span>
                    <span className="font-medium">
                      {items.filter(item => !item.preguntar_cotizacion).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Productos para cotizar:</span>
                    <span className="font-medium">
                      {items.filter(item => item.preguntar_cotizacion).length}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedDiscount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuento ({appliedDiscount.percentage}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  {items.some(item => item.preguntar_cotizacion) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-blue-700">
                        Algunos productos requieren cotización. El precio final puede variar.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-arte-button hover:bg-arte-button/90"
                    disabled={totalItems === 0}
                    onClick={() => setShowCotizacionForm(true)}
                  >
                    Terminar Cotización/pedido
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleClearCart}
                    disabled={totalItems === 0}
                  >
                    Vaciar Carrito
                  </Button>
                </div>

                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => window.location.href = '/catalogo/arteestufas'}
                    className="text-arte-button hover:text-arte-button/80"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
