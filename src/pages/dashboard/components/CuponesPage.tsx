
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Cupon {
  id: string;
  codigo: string;
  descripcion: string | null;
  tipo_descuento: string;
  valor: number;
  fecha_inicio: string;
  fecha_vencimiento: string;
  cantidad_maxima_usos: number;
  cantidad_usos_actuales: number;
  estado: string;
  fecha_creacion: string;
}

const CuponesPage = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCupon, setEditingCupon] = useState<Cupon | null>(null);
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    tipo_descuento: 'porcentaje',
    valor: '',
    fecha_inicio: '',
    fecha_vencimiento: '',
    cantidad_maxima_usos: '1',
    estado: 'activo'
  });

  const { data: cupones, isLoading } = useQuery({
    queryKey: ['cupones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cupones_descuento')
        .select('*')
        .order('fecha_creacion', { ascending: false });
      
      if (error) throw error;
      return data as Cupon[];
    }
  });

  const createCuponMutation = useMutation({
    mutationFn: async (cuponData: any) => {
      const { data, error } = await supabase
        .from('cupones_descuento')
        .insert([{
          ...cuponData,
          creado_por: userProfile?.id,
          codigo: cuponData.codigo.toUpperCase()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cupones'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Cupón creado",
        description: "El cupón se ha creado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el cupón",
        variant: "destructive",
      });
    }
  });

  const updateCuponMutation = useMutation({
    mutationFn: async ({ id, ...cuponData }: any) => {
      const { data, error } = await supabase
        .from('cupones_descuento')
        .update(cuponData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cupones'] });
      setIsDialogOpen(false);
      setEditingCupon(null);
      resetForm();
      toast({
        title: "Cupón actualizado",
        description: "El cupón se ha actualizado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el cupón",
        variant: "destructive",
      });
    }
  });

  const deleteCuponMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cupones_descuento')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cupones'] });
      toast({
        title: "Cupón eliminado",
        description: "El cupón se ha eliminado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el cupón",
        variant: "destructive",
      });
    }
  });

  const toggleEstadoMutation = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: string }) => {
      const { error } = await supabase
        .from('cupones_descuento')
        .update({ estado: estado === 'activo' ? 'inactivo' : 'activo' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cupones'] });
      toast({
        title: "Estado actualizado",
        description: "El estado del cupón se ha actualizado.",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      codigo: '',
      descripcion: '',
      tipo_descuento: 'porcentaje',
      valor: '',
      fecha_inicio: '',
      fecha_vencimiento: '',
      cantidad_maxima_usos: '1',
      estado: 'activo'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cuponData = {
      ...formData,
      valor: parseFloat(formData.valor),
      cantidad_maxima_usos: parseInt(formData.cantidad_maxima_usos)
    };

    if (editingCupon) {
      updateCuponMutation.mutate({ id: editingCupon.id, ...cuponData });
    } else {
      createCuponMutation.mutate(cuponData);
    }
  };

  const openEditDialog = (cupon: Cupon) => {
    setEditingCupon(cupon);
    setFormData({
      codigo: cupon.codigo,
      descripcion: cupon.descripcion || '',
      tipo_descuento: cupon.tipo_descuento,
      valor: cupon.valor.toString(),
      fecha_inicio: cupon.fecha_inicio.split('T')[0],
      fecha_vencimiento: cupon.fecha_vencimiento.split('T')[0],
      cantidad_maxima_usos: cupon.cantidad_maxima_usos.toString(),
      estado: cupon.estado
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCupon(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#4E3B31] mb-2">Cupones de Descuento</h1>
          <p className="text-sm lg:text-base text-[#7C5B4B]">Cargando cupones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="mb-6 lg:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#4E3B31] mb-2">Cupones de Descuento</h1>
          <p className="text-sm lg:text-base text-[#7C5B4B]">Gestiona los cupones de descuento</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={openCreateDialog}
              className="bg-[#A0522D] hover:bg-[#8B4513] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Cupón
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#4E3B31]">
                {editingCupon ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="codigo" className="text-[#4E3B31]">Código del Cupón</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
                  required
                  disabled={!!editingCupon}
                  className="bg-[#D8CFC4]"
                />
              </div>
              
              <div>
                <Label htmlFor="descripcion" className="text-[#4E3B31]">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  className="bg-[#D8CFC4]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo_descuento" className="text-[#4E3B31]">Tipo</Label>
                  <select
                    id="tipo_descuento"
                    value={formData.tipo_descuento}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipo_descuento: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-input bg-[#D8CFC4] text-sm"
                    required
                  >
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="monto_fijo">Monto Fijo ($)</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="valor" className="text-[#4E3B31]">Valor</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                    required
                    className="bg-[#D8CFC4]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha_inicio" className="text-[#4E3B31]">Fecha Inicio</Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                    required
                    className="bg-[#D8CFC4]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fecha_vencimiento" className="text-[#4E3B31]">Fecha Vencimiento</Label>
                  <Input
                    id="fecha_vencimiento"
                    type="date"
                    value={formData.fecha_vencimiento}
                    onChange={(e) => setFormData(prev => ({ ...prev, fecha_vencimiento: e.target.value }))}
                    required
                    className="bg-[#D8CFC4]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cantidad_maxima_usos" className="text-[#4E3B31]">Usos Máximos</Label>
                  <Input
                    id="cantidad_maxima_usos"
                    type="number"
                    min="1"
                    value={formData.cantidad_maxima_usos}
                    onChange={(e) => setFormData(prev => ({ ...prev, cantidad_maxima_usos: e.target.value }))}
                    required
                    className="bg-[#D8CFC4]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="estado" className="text-[#4E3B31]">Estado</Label>
                  <select
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-input bg-[#D8CFC4] text-sm"
                    required
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#A0522D] hover:bg-[#8B4513] text-white"
                  disabled={createCuponMutation.isPending || updateCuponMutation.isPending}
                >
                  {editingCupon ? 'Actualizar' : 'Crear'} Cupón
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#4E3B31] text-lg lg:text-xl">Lista de Cupones</CardTitle>
        </CardHeader>
        <CardContent>
          {cupones && cupones.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#A0522D]/20">
                    <th className="text-left py-3 px-2 text-[#4E3B31] font-medium">Código</th>
                    <th className="text-left py-3 px-2 text-[#4E3B31] font-medium">Tipo</th>
                    <th className="text-left py-3 px-2 text-[#4E3B31] font-medium">Valor</th>
                    <th className="text-left py-3 px-2 text-[#4E3B31] font-medium">Vigencia</th>
                    <th className="text-left py-3 px-2 text-[#4E3B31] font-medium">Estado</th>
                    <th className="text-left py-3 px-2 text-[#4E3B31] font-medium">Usos</th>
                    <th className="text-left py-3 px-2 text-[#4E3B31] font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cupones.map((cupon) => (
                    <tr key={cupon.id} className="border-b border-[#A0522D]/10">
                      <td className="py-3 px-2 font-medium text-[#4E3B31]">{cupon.codigo}</td>
                      <td className="py-3 px-2 text-[#7C5B4B]">
                        {cupon.tipo_descuento === 'porcentaje' ? '%' : '$'}
                      </td>
                      <td className="py-3 px-2 text-[#7C5B4B]">
                        {cupon.tipo_descuento === 'porcentaje' ? `${cupon.valor}%` : `$${cupon.valor}`}
                      </td>
                      <td className="py-3 px-2 text-[#7C5B4B]">
                        {new Date(cupon.fecha_inicio).toLocaleDateString()} - {new Date(cupon.fecha_vencimiento).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          cupon.estado === 'activo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cupon.estado}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[#7C5B4B]">
                        {cupon.cantidad_usos_actuales}/{cupon.cantidad_maxima_usos}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(cupon)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleEstadoMutation.mutate({ id: cupon.id, estado: cupon.estado })}
                            className="h-8 w-8 p-0"
                          >
                            {cupon.estado === 'activo' ? 
                              <PowerOff className="h-3 w-3" /> : 
                              <Power className="h-3 w-3" />
                            }
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteCuponMutation.mutate(cupon.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-[#7C5B4B]">
              <p>No hay cupones registrados</p>
              <p className="text-sm">Crea tu primer cupón usando el botón "Crear Cupón"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CuponesPage;
