
-- Crear tabla para cupones de descuento
CREATE TABLE public.cupones_descuento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  tipo_descuento VARCHAR(10) NOT NULL CHECK (tipo_descuento IN ('porcentaje', 'monto_fijo')),
  valor DECIMAL(10,2) NOT NULL CHECK (valor > 0),
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fecha_vencimiento TIMESTAMP WITH TIME ZONE NOT NULL,
  cantidad_maxima_usos INTEGER NOT NULL DEFAULT 1 CHECK (cantidad_maxima_usos > 0),
  cantidad_usos_actuales INTEGER NOT NULL DEFAULT 0 CHECK (cantidad_usos_actuales >= 0),
  estado VARCHAR(10) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  creado_por UUID NOT NULL REFERENCES public.usuarios(id),
  fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS en la tabla
ALTER TABLE public.cupones_descuento ENABLE ROW LEVEL SECURITY;

-- Política para que solo los admins puedan hacer SELECT
CREATE POLICY "Solo admins pueden ver cupones" 
  ON public.cupones_descuento 
  FOR SELECT 
  USING (get_user_role(auth.uid()) = 'admin'::rol_usuario);

-- Política para que solo los admins puedan INSERT
CREATE POLICY "Solo admins pueden crear cupones" 
  ON public.cupones_descuento 
  FOR INSERT 
  WITH CHECK (get_user_role(auth.uid()) = 'admin'::rol_usuario);

-- Política para que solo los admins puedan UPDATE
CREATE POLICY "Solo admins pueden actualizar cupones" 
  ON public.cupones_descuento 
  FOR UPDATE 
  USING (get_user_role(auth.uid()) = 'admin'::rol_usuario);

-- Política para que solo los admins puedan DELETE
CREATE POLICY "Solo admins pueden eliminar cupones" 
  ON public.cupones_descuento 
  FOR DELETE 
  USING (get_user_role(auth.uid()) = 'admin'::rol_usuario);

-- Trigger para actualizar fecha_actualizacion
CREATE TRIGGER update_cupones_descuento_updated_at
  BEFORE UPDATE ON public.cupones_descuento
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para mejorar rendimiento
CREATE INDEX idx_cupones_descuento_codigo ON public.cupones_descuento(codigo);
CREATE INDEX idx_cupones_descuento_estado ON public.cupones_descuento(estado);
CREATE INDEX idx_cupones_descuento_fechas ON public.cupones_descuento(fecha_inicio, fecha_vencimiento);
