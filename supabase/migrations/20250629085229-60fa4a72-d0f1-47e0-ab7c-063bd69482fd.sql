
-- Crear enum para las decisiones de cookies
CREATE TYPE decision_cookies AS ENUM ('aceptado', 'rechazado');

-- Crear tabla para almacenar consentimientos de cookies
CREATE TABLE public.consentimientos_cookies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_usuario TEXT NOT NULL,
  decision decision_cookies NOT NULL,
  fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  sesion_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear índice para optimizar consultas por IP
CREATE INDEX idx_consentimientos_cookies_ip ON public.consentimientos_cookies(ip_usuario);
CREATE INDEX idx_consentimientos_cookies_fecha ON public.consentimientos_cookies(fecha_hora);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.consentimientos_cookies ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir inserción pública (para registrar consentimientos)
CREATE POLICY "Permitir inserción de consentimientos" ON public.consentimientos_cookies
  FOR INSERT WITH CHECK (true);

-- Crear política para que solo admins puedan ver los consentimientos
CREATE POLICY "Solo admins pueden ver consentimientos" ON public.consentimientos_cookies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );
