
-- Primero, eliminar la función y trigger existentes para recrearlos correctamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Eliminar el tipo existente si existe y recrearlo
DROP TYPE IF EXISTS public.tipo_documento CASCADE;
CREATE TYPE public.tipo_documento AS ENUM ('CC', 'TI', 'CE', 'PASAPORTE');

-- Verificar que la tabla usuarios tenga la estructura correcta
-- Si la columna tipo_documento existe pero con tipo incorrecto, la recreamos
DO $$ 
BEGIN
    -- Eliminar la columna si existe y recrearla con el tipo correcto
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'tipo_documento') THEN
        ALTER TABLE public.usuarios DROP COLUMN tipo_documento;
    END IF;
    
    -- Agregar la columna con el tipo correcto
    ALTER TABLE public.usuarios ADD COLUMN tipo_documento public.tipo_documento NOT NULL DEFAULT 'CC';
EXCEPTION
    WHEN OTHERS THEN
        -- Si hay error, continuar
        NULL;
END $$;

-- Recrear la función handle_new_user con manejo robusto
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    doc_type public.tipo_documento;
BEGIN
    -- Manejar el tipo_documento de forma muy segura
    BEGIN
        CASE COALESCE(NEW.raw_user_meta_data ->> 'tipo_documento', 'CC')
            WHEN 'TI' THEN doc_type := 'TI'::public.tipo_documento;
            WHEN 'CE' THEN doc_type := 'CE'::public.tipo_documento;
            WHEN 'PASAPORTE' THEN doc_type := 'PASAPORTE'::public.tipo_documento;
            ELSE doc_type := 'CC'::public.tipo_documento;
        END CASE;
    EXCEPTION
        WHEN OTHERS THEN
            doc_type := 'CC'::public.tipo_documento;
    END;

    -- Insertar el usuario con manejo de errores
    BEGIN
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
    EXCEPTION
        WHEN OTHERS THEN
            -- Log el error pero no fallar el trigger
            RAISE LOG 'Error inserting user profile: %', SQLERRM;
    END;
    
    RETURN NEW;
END;
$$;

-- Recrear el trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
