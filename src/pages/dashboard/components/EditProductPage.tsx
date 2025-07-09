
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Upload, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditProductPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo_referencia: '',
    descripcion: '',
    materiales: '',
    tamano: '',
    capacidad: '',
    precio: '',
    preguntar_cotizacion: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: productos, isLoading } = useQuery({
    queryKey: ['productos-edit'],
    queryFn: async () => {
      const { data } = await supabase
        .from('productos')
        .select('*')
        .order('fecha_creacion', { ascending: false });
      return data || [];
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updateData }: { id: string; updateData: any }) => {
      const { error } = await supabase
        .from('productos')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos-edit'] });
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente"
      });
      setEditingProduct(null);
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        variant: "destructive"
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos-edit'] });
      toast({
        title: "Éxito",
        description: "Producto eliminado del catálogo"
      });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive"
      });
    }
  });

  const startEditing = (producto: any) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre || '',
      codigo_referencia: producto.codigo_referencia || '',
      descripcion: producto.descripcion || '',
      materiales: producto.materiales || '',
      tamano: producto.tamano || '',
      capacidad: producto.capacidad || '',
      precio: producto.precio ? producto.precio.toString() : '',
      preguntar_cotizacion: producto.preguntar_cotizacion || false,
    });
    setImagePreview(producto.foto_url);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      codigo_referencia: '',
      descripcion: '',
      materiales: '',
      tamano: '',
      capacidad: '',
      precio: '',
      preguntar_cotizacion: false,
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "El archivo no puede ser mayor a 5MB",
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos de imagen",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('productos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct) return;

    if (!formData.preguntar_cotizacion && !formData.precio) {
      toast({
        title: "Error",
        description: "Debe establecer un precio o marcar como cotización",
        variant: "destructive"
      });
      return;
    }

    let fotoUrl = editingProduct.foto_url;

    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl) {
        fotoUrl = uploadedUrl;
      }
    }

    const updateData = {
      nombre: formData.nombre,
      codigo_referencia: formData.codigo_referencia,
      descripcion: formData.descripcion || null,
      materiales: formData.materiales || null,
      tamano: formData.tamano || null,
      capacidad: formData.capacidad || null,
      precio: formData.preguntar_cotizacion ? null : parseFloat(formData.precio) || null,
      preguntar_cotizacion: formData.preguntar_cotizacion,
      foto_url: fotoUrl,
      fecha_actualizacion: new Date().toISOString(),
    };

    updateProductMutation.mutate({ id: editingProduct.id, updateData });
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-arte-title">Editar Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arte-button mx-auto mb-4"></div>
            <p className="text-arte-subtitle">Cargando productos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {editingProduct ? (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-arte-title">Editando: {editingProduct.nombre}</CardTitle>
            <Button
              variant="outline"
              onClick={() => {
                setEditingProduct(null);
                resetForm();
              }}
            >
              Cancelar
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Producto *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo_referencia">Código de Referencia *</Label>
                  <Input
                    id="codigo_referencia"
                    value={formData.codigo_referencia}
                    onChange={(e) => setFormData({ ...formData, codigo_referencia: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="materiales">Materiales</Label>
                  <Input
                    id="materiales"
                    value={formData.materiales}
                    onChange={(e) => setFormData({ ...formData, materiales: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tamano">Tamaño</Label>
                  <Input
                    id="tamano"
                    value={formData.tamano}
                    onChange={(e) => setFormData({ ...formData, tamano: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacidad">Capacidad</Label>
                  <Input
                    id="capacidad"
                    value={formData.capacidad}
                    onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preguntar_cotizacion"
                    checked={formData.preguntar_cotizacion}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, preguntar_cotizacion: !!checked })
                    }
                  />
                  <Label htmlFor="preguntar_cotizacion">
                    Requiere cotización (no tiene precio fijo)
                  </Label>
                </div>

                {!formData.preguntar_cotizacion && (
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio (COP) *</Label>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label>Imagen del Producto</Label>
                
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Vista previa" 
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm text-gray-600">
                          Haz clic para subir una imagen
                        </span>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button type="submit" disabled={updateProductMutation.isPending}>
                  {updateProductMutation.isPending ? 'Actualizando...' : 'Actualizar Producto'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-arte-title">Gestión de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productos?.map((producto: any) => (
                <div key={producto.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          {producto.foto_url ? (
                            <img 
                              src={producto.foto_url} 
                              alt={producto.nombre}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <span className="text-xs text-gray-500 text-center">Sin imagen</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-arte-title">{producto.nombre}</h3>
                          <p className="text-arte-subtitle">Código: {producto.codigo_referencia}</p>
                          <p className="text-arte-subtitle">{producto.descripcion}</p>
                          {producto.precio && (
                            <p className="text-green-600 font-medium">Precio: ${producto.precio} COP</p>
                          )}
                          <span className={`px-2 py-1 rounded text-xs ${
                            producto.preguntar_cotizacion ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {producto.preguntar_cotizacion ? 'Cotización' : 'Precio fijo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(producto)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Está seguro de eliminar este producto del catálogo? Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProductMutation.mutate(producto.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
              {(!productos || productos.length === 0) && (
                <p className="text-center text-arte-subtitle py-8">No hay productos registrados</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditProductPage;
