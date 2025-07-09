
-- Arreglar la función handle_new_user para manejar correctamente el tipo_documento
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
    COALESCE((NEW.raw_user_meta_data ->> 'tipo_documento')::public.tipo_documento, 'CC'::public.tipo_documento),
    COALESCE(NEW.raw_user_meta_data ->> 'cedula', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'direccion', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'pais', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'departamento', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'telefono', '')
  );
  RETURN NEW;
END;
$$;
