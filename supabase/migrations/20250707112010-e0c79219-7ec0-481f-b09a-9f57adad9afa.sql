
-- Eliminar la restricción de clave foránea existente
ALTER TABLE public.cotizacion_productos DROP CONSTRAINT cotizacion_productos_producto_id_fkey;

-- Agregar la nueva restricción con CASCADE para eliminación
ALTER TABLE public.cotizacion_productos 
ADD CONSTRAINT cotizacion_productos_producto_id_fkey 
FOREIGN KEY (producto_id) REFERENCES public.productos(id) 
ON DELETE CASCADE;
