
-- Crear bucket para productos si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO NOTHING;

-- Crear políticas para el bucket de productos
CREATE POLICY "Cualquiera puede ver imágenes de productos"
ON storage.objects FOR SELECT
USING (bucket_id = 'productos');

CREATE POLICY "Solo admins pueden subir imágenes de productos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'productos' AND 
  auth.uid() IN (
    SELECT id FROM usuarios WHERE rol = 'admin'
  )
);

CREATE POLICY "Solo admins pueden actualizar imágenes de productos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'productos' AND 
  auth.uid() IN (
    SELECT id FROM usuarios WHERE rol = 'admin'
  )
);

CREATE POLICY "Solo admins pueden eliminar imágenes de productos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'productos' AND 
  auth.uid() IN (
    SELECT id FROM usuarios WHERE rol = 'admin'
  )
);
