
-- Crear tipos ENUM para mayor integridad de datos
CREATE TYPE public.tipo_documento AS ENUM ('CC', 'TI', 'CE', 'PASAPORTE');
CREATE TYPE public.rol_usuario AS ENUM ('admin', 'cliente', 'usuario');
CREATE TYPE public.estado_usuario AS ENUM ('activo', 'inactivo');
CREATE TYPE public.estado_cotizacion AS ENUM ('cotizacion-pendiente', 'cotizacion-hecha', 'trabajo-contratado');

-- Tabla usuarios (profiles) para información adicional de auth.users
CREATE TABLE public.usuarios (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  tipo_documento tipo_documento NOT NULL,
  cedula VARCHAR(20) NOT NULL UNIQUE,
  direccion TEXT,
  pais VARCHAR(100),
  departamento VARCHAR(100),
  telefono VARCHAR(20),
  rol rol_usuario NOT NULL DEFAULT 'usuario',
  estado estado_usuario NOT NULL DEFAULT 'activo',
  fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Tabla productos
CREATE TABLE public.productos (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  codigo_referencia VARCHAR(50) NOT NULL UNIQUE,
  materiales TEXT,
  tamano VARCHAR(100),
  capacidad TEXT,
  precio NUMERIC(12, 2),
  preguntar_cotizacion BOOLEAN NOT NULL DEFAULT FALSE,
  foto_url TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
  creado_por UUID NOT NULL REFERENCES public.usuarios(id),
  PRIMARY KEY (id)
);

-- Tabla cotizaciones
CREATE TABLE public.cotizaciones (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id),
  estado estado_cotizacion NOT NULL DEFAULT 'cotizacion-pendiente',
  direccion_envio TEXT NOT NULL,
  departamento VARCHAR(100) NOT NULL,
  comentarios_adicionales TEXT,
  fecha_solicitud TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

-- Tabla cotizacion_productos (tabla de unión normalizada)
CREATE TABLE public.cotizacion_productos (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  cotizacion_id UUID NOT NULL REFERENCES public.cotizaciones(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES public.productos(id),
  cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  PRIMARY KEY (id),
  UNIQUE (cotizacion_id, producto_id)
);

-- Tabla trabajos
CREATE TABLE public.trabajos (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  cotizacion_id UUID NOT NULL REFERENCES public.cotizaciones(id) UNIQUE,
  fecha_asignacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  observaciones TEXT,
  PRIMARY KEY (id)
);

-- Tabla sesiones para control de tokens (opcional)
CREATE TABLE public.sesiones (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fecha_expiracion TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (id)
);

-- Crear índices para optimización de consultas
CREATE INDEX idx_usuarios_cedula ON public.usuarios(cedula);
CREATE INDEX idx_usuarios_rol ON public.usuarios(rol);
CREATE INDEX idx_productos_codigo ON public.productos(codigo_referencia);
CREATE INDEX idx_productos_creado_por ON public.productos(creado_por);
CREATE INDEX idx_cotizaciones_usuario ON public.cotizaciones(usuario_id);
CREATE INDEX idx_cotizaciones_estado ON public.cotizaciones(estado);
CREATE INDEX idx_cotizacion_productos_cotizacion ON public.cotizacion_productos(cotizacion_id);
CREATE INDEX idx_cotizacion_productos_producto ON public.cotizacion_productos(producto_id);
CREATE INDEX idx_trabajos_cotizacion ON public.trabajos(cotizacion_id);
CREATE INDEX idx_sesiones_usuario ON public.sesiones(usuario_id);
CREATE INDEX idx_sesiones_token ON public.sesiones(token);

-- Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.usuarios (id, nombre, apellido, tipo_documento, cedula, direccion, pais, departamento, telefono)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nombre', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'apellido', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'tipo_documento')::tipo_documento, 'CC'),
    COALESCE(NEW.raw_user_meta_data ->> 'cedula', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'direccion', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'pais', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'departamento', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'telefono', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Función para actualizar timestamp de actualizacion
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar timestamps
CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON public.productos
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_cotizaciones_updated_at
  BEFORE UPDATE ON public.cotizaciones
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Habilitar Row Level Security en todas las tablas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizacion_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trabajos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesiones ENABLE ROW LEVEL SECURITY;

-- Función de seguridad para verificar roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS rol_usuario
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT rol FROM public.usuarios WHERE id = user_id;
$$;

-- Políticas RLS para usuarios
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON public.usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los admins pueden ver todos los usuarios" ON public.usuarios
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.usuarios
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Los admins pueden actualizar cualquier usuario" ON public.usuarios
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- Políticas RLS para productos
CREATE POLICY "Todos pueden ver productos" ON public.productos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Solo admins pueden crear productos" ON public.productos
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Solo admins pueden actualizar productos" ON public.productos
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Solo admins pueden eliminar productos" ON public.productos
  FOR DELETE USING (public.get_user_role(auth.uid()) = 'admin');

-- Políticas RLS para cotizaciones
CREATE POLICY "Los usuarios pueden ver sus propias cotizaciones" ON public.cotizaciones
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Los admins pueden ver todas las cotizaciones" ON public.cotizaciones
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Los usuarios pueden crear sus propias cotizaciones" ON public.cotizaciones
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Solo admins pueden actualizar cotizaciones" ON public.cotizaciones
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- Políticas RLS para cotizacion_productos
CREATE POLICY "Ver productos de cotizaciones propias" ON public.cotizacion_productos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cotizaciones 
      WHERE id = cotizacion_id AND usuario_id = auth.uid()
    ) OR public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Insertar productos en cotizaciones propias" ON public.cotizacion_productos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cotizaciones 
      WHERE id = cotizacion_id AND usuario_id = auth.uid()
    )
  );

-- Políticas RLS para trabajos
CREATE POLICY "Ver trabajos de cotizaciones propias" ON public.trabajos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cotizaciones 
      WHERE id = cotizacion_id AND usuario_id = auth.uid()
    ) OR public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Solo admins pueden crear trabajos" ON public.trabajos
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Solo admins pueden actualizar trabajos" ON public.trabajos
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- Políticas RLS para sesiones
CREATE POLICY "Los usuarios pueden ver sus propias sesiones" ON public.sesiones
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden crear sus propias sesiones" ON public.sesiones
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias sesiones" ON public.sesiones
  FOR DELETE USING (auth.uid() = usuario_id);

-- Habilitar realtime para cotizaciones
ALTER TABLE public.cotizaciones REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cotizaciones;

-- Habilitar realtime para trabajos
ALTER TABLE public.trabajos REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trabajos;
