-- ==============================================================================
-- TUS RAÍCES MX - SCRIPT DE BLINDAJE DE SEGURIDAD Y POLÍTICAS RLS (SUPABASE)
-- Ejecuta este script en Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. HABILITAR ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.legal_articles ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. TABLA USER_PROFILES (Privacidad estricta: Nadie anónimo puede leer perfiles)
-- ==============================================================================
DROP POLICY IF EXISTS "Permitir lectura publica o autenticada de perfiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow public read" ON public.user_profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir a usuarios leer su propio perfil" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir a administradores leer todos los perfiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir a usuarios actualizar su propio perfil" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.user_profiles;

-- Cada usuario únicamente puede leer su propio perfil
CREATE POLICY "Permitir a usuarios leer su propio perfil"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Los administradores y service_role pueden ver todos los perfiles
CREATE POLICY "Permitir a administradores leer todos los perfiles"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR auth.role() = 'service_role'
    );

-- Cada usuario puede actualizar sus datos excepto su propio rol
CREATE POLICY "Permitir a usuarios actualizar su propio perfil"
    ON public.user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Solo administradores pueden insertar o borrar perfiles manualmente
CREATE POLICY "Admins can manage profiles"
    ON public.user_profiles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR auth.role() = 'service_role'
    );

-- ==============================================================================
-- 3. TABLA CONTACT_MESSAGES (Mensajes del formulario web de contacto)
-- ==============================================================================
DROP POLICY IF EXISTS "Anyone can insert contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins and agents can read messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins and agents can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins and agents can delete messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Permitir a todos enviar mensajes" ON public.contact_messages;
DROP POLICY IF EXISTS "Permitir lectura solo a admin y agentes" ON public.contact_messages;

-- Cualquier visitante web (anon o autenticado) puede enviar un mensaje
CREATE POLICY "Anyone can insert contact message"
    ON public.contact_messages FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- SOLO administradores y agentes pueden leer los mensajes (NUNCA público/anónimo)
CREATE POLICY "Only admins and agents can read messages"
    ON public.contact_messages FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'agente')
        )
        OR auth.role() = 'service_role'
    );

-- Solo administradores y agentes pueden marcar como leído o gestionar mensajes
CREATE POLICY "Only admins and agents can update messages"
    ON public.contact_messages FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'agente')
        )
        OR auth.role() = 'service_role'
    );

-- Solo administradores pueden eliminar mensajes
CREATE POLICY "Only admins can delete messages"
    ON public.contact_messages FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR auth.role() = 'service_role'
    );

-- ==============================================================================
-- 4. TABLA PRODUCTS (Catálogo inmobiliario)
-- ==============================================================================
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.products;
DROP POLICY IF EXISTS "Admins and agents can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins and agents can update products" ON public.products;
DROP POLICY IF EXISTS "Only admins can delete products" ON public.products;

-- Lectura pública para cualquier visitante
CREATE POLICY "Public read products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (true);

-- Creación solo por admin o agentes
CREATE POLICY "Admins and agents can insert products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'agente')
        )
        OR auth.role() = 'service_role'
    );

-- Edición solo por admin o agentes
CREATE POLICY "Admins and agents can update products"
    ON public.products FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'agente')
        )
        OR auth.role() = 'service_role'
    );

-- Eliminación exclusiva de administradores
CREATE POLICY "Only admins can delete products"
    ON public.products FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR auth.role() = 'service_role'
    );

-- ==============================================================================
-- 5. TABLA PRODUCT_MEDIA (Galería de fotos y videos de propiedades)
-- ==============================================================================
DROP POLICY IF EXISTS "Public read product media" ON public.product_media;
DROP POLICY IF EXISTS "Admins and agents can manage media" ON public.product_media;

CREATE POLICY "Public read product media"
    ON public.product_media FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins and agents can manage media"
    ON public.product_media FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'agente')
        )
        OR auth.role() = 'service_role'
    );

-- ==============================================================================
-- 6. TABLA CONTENT_BLOCKS & LEGAL_ARTICLES
-- ==============================================================================
DROP POLICY IF EXISTS "Public read content blocks" ON public.content_blocks;
DROP POLICY IF EXISTS "Admins can manage content blocks" ON public.content_blocks;
DROP POLICY IF EXISTS "Public read legal articles" ON public.legal_articles;
DROP POLICY IF EXISTS "Admins can manage legal articles" ON public.legal_articles;

CREATE POLICY "Public read content blocks"
    ON public.content_blocks FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage content blocks"
    ON public.content_blocks FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'agente')
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Public read legal articles"
    ON public.legal_articles FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage legal articles"
    ON public.legal_articles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'agente')
        )
        OR auth.role() = 'service_role'
    );
