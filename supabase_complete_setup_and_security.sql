-- ==============================================================================
-- TUS RAÍCES MX - SETUP COMPLETO DE BASE DE DATOS Y BLINDAJE DE SEGURIDAD RLS
-- Copia y pega TODO este script en: Supabase -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. EXTENSIÓN PARA GENERAR UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLA USER_PROFILES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'agente', 'asesor', 'cliente')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Funciones de ayuda con SECURITY DEFINER para evitar recursión infinita en RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_agent()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'agente')
  );
$$;

-- ==============================================================================
-- 3. TABLA PRODUCTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT,
    neighborhood TEXT,
    address TEXT,
    street_type TEXT,
    street_name TEXT,
    exterior_number TEXT,
    interior_number TEXT,
    locality TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    is_commercial BOOLEAN DEFAULT false,
    main_image_url TEXT,
    features TEXT[] DEFAULT '{}',
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    area NUMERIC DEFAULT 0,
    floors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. TABLA PRODUCT_MEDIA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.product_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. TABLA CONTACT_MESSAGES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    message TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. TABLA SITE_CONTENT
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. TABLA LEGAL_ARTICLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.legal_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ley', 'imss', 'infonavit', 'notarial', 'general')),
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    important_notice TEXT DEFAULT NULL,
    published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 8. HABILITAR ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
-- ==============================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_articles ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 9. LIMPIEZA DE POLÍTICAS ANTERIORES (Evitar duplicados)
-- ==============================================================================
-- user_profiles
DROP POLICY IF EXISTS "Permitir lectura publica o autenticada de perfiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow public read" ON public.user_profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir a usuarios leer su propio perfil" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir a administradores leer todos los perfiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir a usuarios actualizar su propio perfil" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.user_profiles;

-- contact_messages
DROP POLICY IF EXISTS "Anyone can insert contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins and agents can read messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins and agents can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can delete messages" ON public.contact_messages;

-- products
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admins and agents can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins and agents can update products" ON public.products;
DROP POLICY IF EXISTS "Only admins can delete products" ON public.products;

-- product_media
DROP POLICY IF EXISTS "Public read product media" ON public.product_media;
DROP POLICY IF EXISTS "Admins and agents can manage media" ON public.product_media;

-- site_content
DROP POLICY IF EXISTS "Public read site content" ON public.site_content;
DROP POLICY IF EXISTS "Permitir lectura publica de contenido" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;
DROP POLICY IF EXISTS "Permitir gestion de contenido a admin y service_role" ON public.site_content;

-- legal_articles
DROP POLICY IF EXISTS "Public read legal articles" ON public.legal_articles;
DROP POLICY IF EXISTS "Permitir lectura publica de articulos legales" ON public.legal_articles;
DROP POLICY IF EXISTS "Admins can manage legal articles" ON public.legal_articles;
DROP POLICY IF EXISTS "Permitir gestion de articulos legales a admin y service_role" ON public.legal_articles;

-- ==============================================================================
-- 10. POLÍTICAS DE SEGURIDAD (RLS) ACTIVAS
-- ==============================================================================

-- --- USER_PROFILES (Privacidad estricta) ---
CREATE POLICY "Permitir a usuarios leer su propio perfil"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Permitir a administradores leer todos los perfiles"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Permitir a usuarios actualizar su propio perfil"
    ON public.user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage profiles"
    ON public.user_profiles FOR ALL
    TO authenticated
    USING (public.is_admin());

-- --- CONTACT_MESSAGES ---
-- Público puede enviar mensajes de contacto
CREATE POLICY "Anyone can insert contact message"
    ON public.contact_messages FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Solo administradores y agentes pueden leer y actualizar mensajes
CREATE POLICY "Only admins and agents can read messages"
    ON public.contact_messages FOR SELECT
    TO authenticated
    USING (public.is_admin_or_agent());

CREATE POLICY "Only admins and agents can update messages"
    ON public.contact_messages FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_agent());

CREATE POLICY "Only admins can delete messages"
    ON public.contact_messages FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- --- PRODUCTS ---
-- Público puede ver el catálogo
CREATE POLICY "Public read products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins and agents can insert products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_agent());

CREATE POLICY "Admins and agents can update products"
    ON public.products FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_agent());

CREATE POLICY "Only admins can delete products"
    ON public.products FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- --- PRODUCT_MEDIA ---
CREATE POLICY "Public read product media"
    ON public.product_media FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins and agents can manage media"
    ON public.product_media FOR ALL
    TO authenticated
    USING (public.is_admin_or_agent());

-- --- SITE_CONTENT ---
CREATE POLICY "Public read site content"
    ON public.site_content FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage site content"
    ON public.site_content FOR ALL
    TO authenticated
    USING (public.is_admin_or_agent());

-- --- LEGAL_ARTICLES ---
CREATE POLICY "Public read legal articles"
    ON public.legal_articles FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage legal articles"
    ON public.legal_articles FOR ALL
    TO authenticated
    USING (public.is_admin_or_agent());
