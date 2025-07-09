
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/hooks/useCartStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

const cotizacionSchema = z.object({
  direccion_envio: z.string().min(1, 'La dirección de entrega es requerida'),
  departamento: z.string().min(1, 'El departamento es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  comentarios_adicionales: z.string().optional(),
});

type CotizacionForm = z.infer<typeof cotizacionSchema>;

interface CotizacionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CotizacionFormComponent = ({ onSuccess, onCancel }: CotizacionFormProps) => {
  const { user } = useAuth();
  const { items, clearCart } = useCartStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CotizacionForm>({
    resolver: zodResolver(cotizacionSchema),
    defaultValues: {
      direccion_envio: '',
      departamento: '',
      telefono: '',
      comentarios_adicionales: '',
    },
  });

  const submitCotizacion = useMutation({
    mutationFn: async (data: CotizacionForm) => {
      if (!user) throw new Error('Usuario no autenticado');

      // Crear la cotización
      const { data: cotizacion, error: cotizacionError } = await supabase
        .from('cotizaciones')
        .insert({
          usuario_id: user.id,
          direccion_envio: data.direccion_envio,
          departamento: data.departamento,
          comentarios_adicionales: data.comentarios_adicionales || null,
        })
        .select()
        .single();

      if (cotizacionError) throw cotizacionError;

      // Agregar los productos a la cotización
      const productosParaCotizacion = items.map(item => ({
        cotizacion_id: cotizacion.id,
        producto_id: item.id,
        cantidad: item.quantity,
      }));

      const { error: productosError } = await supabase
        .from('cotizacion_productos')
        .insert(productosParaCotizacion);

      if (productosError) throw productosError;

      return cotizacion;
    },
    onSuccess: () => {
      clearCart();
      toast({
        title: "Cotización enviada",
        description: "Tu cotización ha sido enviada exitosamente. Te contactaremos pronto.",
      });
      onSuccess();
    },
    onError: (error) => {
      console.error('Error sending cotización:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la cotización. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CotizacionForm) => {
    setIsSubmitting(true);
    await submitCotizacion.mutateAsync(data);
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-arte-title">Inicia sesión para continuar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-arte-subtitle mb-4">
            Debes iniciar sesión para solicitar una cotización.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => window.location.href = '/login'} className="bg-arte-button hover:bg-arte-button/90">
              Iniciar Sesión
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-arte-title">Información del pedido/cotizacioo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Información del usuario (solo lectura) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre completo</label>
                <p className="text-sm text-gray-900">{user.user_metadata?.nombre} {user.user_metadata?.apellido}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Cédula</label>
                <p className="text-sm text-gray-900">{user.user_metadata?.cedula}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="direccion_envio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección de entrega *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa la dirección completa de entrega"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Norte de Santander, Antioquia, Valle del Cauca"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Número de teléfono de contacto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comentarios_adicionales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios adicionales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cualquier información adicional sobre la cotizacion/pedido del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-arte-button hover:bg-arte-button/90"
              >
                {isSubmitting ? 'Enviando...' : 'Finalizar'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CotizacionFormComponent;
