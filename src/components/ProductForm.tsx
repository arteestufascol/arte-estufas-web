
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Upload, X } from 'lucide-react';

const productSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  codigo_referencia: z.string().min(1, 'El código de referencia es requerido'),
  descripcion: z.string().optional(),
  materiales: z.string().optional(),
  tamano: z.string().optional(),
  capacidad: z.string().optional(),
  precio: z.number().positive('El precio debe ser mayor a 0').optional(),
  preguntar_cotizacion: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
}

const ProductForm = ({ onSuccess }: ProductFormProps) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      preguntar_cotizacion: false,
    }
  });

  const preguntarCotizacion = watch('preguntar_cotizacion');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(filePath, file, {
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('productos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!userProfile?.id) {
      toast({
        title: "Error",
        description: "No se pudo identificar el usuario",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Validar que si no pregunta cotización, debe tener precio
      if (!data.preguntar_cotizacion && !data.precio) {
        toast({
          title: "Error",
          description: "Debe establecer un precio o marcar como cotización",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      let fotoUrl: string | null = null;

      // Subir imagen si hay una seleccionada
      if (selectedFile) {
        try {
          fotoUrl = await uploadImage(selectedFile);
          if (!fotoUrl) {
            console.log('No se pudo subir la imagen, creando producto sin imagen');
          }
        } catch (error) {
          console.error('Error al subir imagen:', error);
          // Continuar sin imagen si falla la subida
        }
      }

      // Crear el producto
      const productData = {
        nombre: data.nombre,
        codigo_referencia: data.codigo_referencia,
        descripcion: data.descripcion || null,
        materiales: data.materiales || null,
        tamano: data.tamano || null,
        capacidad: data.capacidad || null,
        precio: data.preguntar_cotizacion ? null : data.precio || null,
        preguntar_cotizacion: data.preguntar_cotizacion,
        foto_url: fotoUrl,
        creado_por: userProfile.id,
      };

      const { error } = await supabase
        .from('productos')
        .insert([productData]);

      if (error) {
        console.error('Error creating product:', error);
        toast({
          title: "Error",
          description: "Error al crear el producto: " + error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Éxito",
        description: fotoUrl ? "Producto creado correctamente" : "Producto creado correctamente (sin imagen)",
      });

      // Limpiar formulario
      reset();
      removeImage();
      onSuccess?.();

    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast({
        title: "Error",
        description: "Error inesperado al crear el producto",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-arte-title">Crear Nuevo Producto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input 
                id="nombre"
                {...register('nombre')}
                placeholder="Ej: Estufa Rústica Grande"
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            {/* Código de Referencia */}
            <div className="space-y-2">
              <Label htmlFor="codigo_referencia">Código de Referencia *</Label>
              <Input 
                id="codigo_referencia"
                {...register('codigo_referencia')}
                placeholder="Ej: EST-001"
                className={errors.codigo_referencia ? 'border-red-500' : ''}
              />
              {errors.codigo_referencia && (
                <p className="text-sm text-red-500">{errors.codigo_referencia.message}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea 
              id="descripcion"
              {...register('descripcion')}
              placeholder="Describe las características principales del producto..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Materiales */}
            <div className="space-y-2">
              <Label htmlFor="materiales">Materiales</Label>
              <Input 
                id="materiales"
                {...register('materiales')}
                placeholder="Ej: Hierro fundido, Acero"
              />
            </div>

            {/* Tamaño */}
            <div className="space-y-2">
              <Label htmlFor="tamano">Tamaño</Label>
              <Input 
                id="tamano"
                {...register('tamano')}
                placeholder="Ej: 60x40x30 cm"
              />
            </div>

            {/* Capacidad */}
            <div className="space-y-2">
              <Label htmlFor="capacidad">Capacidad</Label>
              <Input 
                id="capacidad"
                {...register('capacidad')}
                placeholder="Ej: 5-10 personas"
              />
            </div>
          </div>

          {/* Cotización vs Precio */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="preguntar_cotizacion"
                checked={preguntarCotizacion}
                onCheckedChange={(checked) => setValue('preguntar_cotizacion', !!checked)}
              />
              <Label htmlFor="preguntar_cotizacion">
                Requiere cotización (no tiene precio fijo)
              </Label>
            </div>

            {!preguntarCotizacion && (
              <div className="space-y-2">
                <Label htmlFor="precio">Precio *</Label>
                <Input 
                  id="precio"
                  type="number"
                  step="0.01"
                  {...register('precio', { valueAsNumber: true })}
                  placeholder="0.00"
                  className={errors.precio ? 'border-red-500' : ''}
                />
                {errors.precio && (
                  <p className="text-sm text-red-500">{errors.precio.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Imagen del Producto */}
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
                  onClick={removeImage}
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
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF hasta 5MB
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

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                removeImage();
              }}
              disabled={isSubmitting}
            >
              Limpiar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Producto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
