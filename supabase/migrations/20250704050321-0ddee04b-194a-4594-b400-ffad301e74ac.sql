
-- Actualizar la política para permitir que cualquiera pueda ver productos sin autenticación
DROP POLICY IF EXISTS "Todos pueden ver productos" ON productos;

CREATE POLICY "Todos pueden ver productos publicamente" 
ON productos FOR SELECT 
USING (true);
