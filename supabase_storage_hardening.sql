-- ==============================================================================
-- BLINDAJE DE SUPABASE STORAGE: BUCKET 'product-images'
-- ==============================================================================

-- 1. Asegurar que RLS esté activo en storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas inseguras previas que permitían a usuarios anónimos borrar o modificar
DROP POLICY IF EXISTS "Permitir lectura publica de product-images" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida a autenticados o service_role" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualizacion y borrado de imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;

-- 3. Lectura PÚBLICA permitida (necesaria para mostrar imágenes en la web)
CREATE POLICY "Permitir lectura publica de product-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

-- 4. Inserción RESTRINGIDA: Solo Administradores, Agentes o service_role
CREATE POLICY "Restringir subida a admin y agentes"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'product-images'
        AND (
            public.is_admin_or_agent()
            OR auth.role() = 'service_role'
        )
    );

-- 5. Actualización y Borrado RESTRINGIDO: Solo Administradores o service_role
CREATE POLICY "Restringir modificacion y borrado a admin"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'product-images'
        AND (
            public.is_admin()
            OR auth.role() = 'service_role'
        )
    );

CREATE POLICY "Restringir eliminacion a admin"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'product-images'
        AND (
            public.is_admin()
            OR auth.role() = 'service_role'
        )
    );
