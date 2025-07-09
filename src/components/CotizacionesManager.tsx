
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const CotizacionesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updatingStates, setUpdatingStates] = useState<Record<string, boolean>>({});

  const { data: cotizaciones, isLoading } = useQuery({
    queryKey: ['cotizaciones-admin'],
    queryFn: async () => {
      const { data } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          usuarios(nombre, apellido, cedula, telefono),
          cotizacion_productos(
            cantidad,
            productos(nombre, codigo_referencia, precio, preguntar_cotizacion)
          )
        `)
        .order('fecha_solicitud', { ascending: false });
      return data || [];
    }
  });

  const updateStateMutation = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: string }) => {
      const { error } = await supabase
        .from('cotizaciones')
        .update({ 
          estado: estado as any,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cotizaciones-admin'] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la cotización ha sido actualizado correctamente"
      });
    },
    onError: (error) => {
      console.error('Error updating state:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la cotización",
        variant: "destructive"
      });
    },
    onSettled: (_, __, variables) => {
      setUpdatingStates(prev => ({ ...prev, [variables.id]: false }));
    }
  });

  const handleStateChange = (cotizacionId: string, newState: string) => {
    setUpdatingStates(prev => ({ ...prev, [cotizacionId]: true }));
    updateStateMutation.mutate({ id: cotizacionId, estado: newState });
  };

  // Suscripción en tiempo real para nuevas cotizaciones
  React.useEffect(() => {
    const channel = supabase
      .channel('cotizaciones-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cotizaciones'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['cotizaciones-admin'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-arte-title">Gestión de Cotizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arte-button mx-auto mb-4"></div>
            <p className="text-arte-subtitle">Cargando cotizaciones...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-arte-title">Gestión de Cotizaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cotizaciones?.map((cotizacion: any) => (
            <div key={cotizacion.id} className="border rounded p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-arte-title">
                    {cotizacion.usuarios?.nombre} {cotizacion.usuarios?.apellido}
                  </h3>
                  <p className="text-arte-subtitle">ID: {cotizacion.id.slice(0, 8)}</p>
                  <p className="text-arte-subtitle">Cédula: {cotizacion.usuarios?.cedula}</p>
                  <p className="text-arte-subtitle">Teléfono: {cotizacion.usuarios?.telefono || 'No registrado'}</p>
                  <p className="text-arte-subtitle">Fecha: {new Date(cotizacion.fecha_solicitud).toLocaleDateString()}</p>
                  <p className="text-arte-subtitle">Departamento: {cotizacion.departamento}</p>
                  <p className="text-arte-subtitle">Dirección: {cotizacion.direccion_envio}</p>
                  {cotizacion.comentarios_adicionales && (
                    <p className="text-arte-subtitle mt-2">
                      <span className="font-medium">Comentarios:</span> {cotizacion.comentarios_adicionales}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Estado:</span>
                    <Select
                      value={cotizacion.estado}
                      onValueChange={(value) => handleStateChange(cotizacion.id, value)}
                      disabled={updatingStates[cotizacion.id]}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cotizacion-pendiente">Pendiente</SelectItem>
                        <SelectItem value="cotizacion-hecha">Cotización Lista</SelectItem>
                        <SelectItem value="trabajo-contratado">Trabajo Contratado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {updatingStates[cotizacion.id] && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-arte-button border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-arte-subtitle">Actualizando...</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Productos solicitados:</h4>
                <div className="space-y-2">
                  {cotizacion.cotizacion_productos?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {item.productos?.nombre}
                        </p>
                        <p className="text-xs text-arte-subtitle">
                          Código: {item.productos?.codigo_referencia} - Cantidad: {item.cantidad}
                        </p>
                      </div>
                      <div className="text-right">
                        {item.productos?.preguntar_cotizacion ? (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            Para cotizar
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-green-600">
                            ${item.productos?.precio?.toFixed(2) || '0.00'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {(!cotizaciones || cotizaciones.length === 0) && (
            <p className="text-center text-arte-subtitle py-8">No hay cotizaciones registradas</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CotizacionesManager;
