
-- Crear el enum tipo_documento si no existe
DO $$ BEGIN
    CREATE TYPE public.tipo_documento AS ENUM ('CC', 'TI', 'CE', 'PASAPORTE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Arreglar la función handle_new_user para manejar correctamente el tipo_documento
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    doc_type public.tipo_documento;
BEGIN
    -- Manejar el tipo_documento de forma segura
    CASE COALESCE(NEW.raw_user_meta_data ->> 'tipo_documento', 'CC')
        WHEN 'TI' THEN doc_type := 'TI';
        WHEN 'CE' THEN doc_type := 'CE';
        WHEN 'PASAPORTE' THEN doc_type := 'PASAPORTE';
        ELSE doc_type := 'CC';
    END CASE;

    INSERT INTO public.usuarios (id, nombre, apellido, tipo_documento, cedula, direccion, pais, departamento, telefono)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'nombre', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'apellido', ''),
        doc_type,
        COALESCE(NEW.raw_user_meta_data ->> 'cedula', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'direccion', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'pais', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'departamento', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'telefono', '')
    );
    RETURN NEW;
END;
$$;

-- Verificar que el trigger existe, si no crearlo
DO $$ BEGIN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
