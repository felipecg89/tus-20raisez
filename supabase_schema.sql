-- ==============================================================================
-- SCHEMA SUPABASE PARA TUSRAICES.CLIK (Tus_Raices_MX)
-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA USER_PROFILES
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'agente', 'asesor', 'cliente')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para user_profiles (NUNCA permitir lectura pública de perfiles)
DROP POLICY IF EXISTS "Permitir lectura publica o autenticada de perfiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir a usuarios actualizar su propio perfil" ON public.user_profiles;

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
    USING (auth.uid() = id);

-- 3. TABLA PRODUCTS
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
    type TEXT NOT NULL, -- 'casa', 'terreno', 'departamento', etc.
    category TEXT NOT NULL, -- 'compra', 'renta', etc.
    is_commercial BOOLEAN DEFAULT false,
    main_image_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    bedrooms INTEGER DEFAULT 0,
    bathrooms NUMERIC DEFAULT 0,
    area NUMERIC DEFAULT 0,
    floors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Políticas para products
CREATE POLICY "Permitir lectura publica de propiedades"
    ON public.products FOR SELECT
    USING (true);

CREATE POLICY "Permitir insercion a administradores y asesores"
    ON public.products FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'asesor')
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Permitir actualizacion a administradores y asesores"
    ON public.products FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'asesor')
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Permitir eliminacion a administradores"
    ON public.products FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR auth.role() = 'service_role'
    );

-- 4. TABLA PRODUCT_MEDIA
CREATE TABLE IF NOT EXISTS public.product_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL DEFAULT 'image',
    media_url TEXT NOT NULL,
    storage_path TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en product_media
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de imagenes"
    ON public.product_media FOR SELECT
    USING (true);

CREATE POLICY "Permitir gestion de imagenes a service_role y admin"
    ON public.product_media FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'asesor')
        )
        OR auth.role() = 'service_role'
    );

-- 5. CREACIÓN DEL BUCKET DE STORAGE PARA IMÁGENES
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage para product-images
CREATE POLICY "Permitir lectura publica de product-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Permitir subida a autenticados o service_role"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Permitir actualizacion y borrado de imagenes"
    ON storage.objects FOR ALL
    USING (bucket_id = 'product-images');

-- 6. DATOS INICIALES (CATÁLOGO SEMILLA)
INSERT INTO public.products (name, description, price, city, state, postal_code, neighborhood, address, type, category, is_commercial, main_image_url, features, bedrooms, bathrooms, area, floors)
VALUES
(
    'Casa Colonial en Guanajuato',
    'Hermosa casa colonial con patio interior, cantera mexicana, acabados de cedro y vista panorámica a la ciudad histórica.',
    180000,
    'Guanajuato',
    'Guanajuato',
    '36000',
    'Centro Histórico',
    'Calle Cantarranas 45',
    'casa',
    'compra',
    false,
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
    '["Patio central con fuente", "Cochera techada", "Terraza con vista", "Cisterna de 10,000 L"]'::jsonb,
    3,
    2,
    250,
    2
),
(
    'Departamento Vista al Mar en Jalisco',
    'Moderno departamento frente a la bahía en Puerto Vallarta, acceso directo a la playa, alberca infinity y amenidades de lujo.',
    250000,
    'Puerto Vallarta',
    'Jalisco',
    '48300',
    'Zona Hotelera Norte',
    'Av. Paseo de la Marina 210',
    'casa',
    'compra',
    false,
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    '["Alberca infinity", "Seguridad 24/7", "Balcón privado con vista al mar", "Gimnasio y spa"]'::jsonb,
    2,
    2,
    150,
    1
),
(
    'Residencia Contemporánea Monterrey',
    'Espectacular casa contemporánea en fraccionamiento privado con vigilancia, acabados de mármol y amplio jardín.',
    320000,
    'Monterrey',
    'Nuevo León',
    '66260',
    'Valle Oriente',
    'Paseo de las Cumbres 500',
    'casa',
    'compra',
    false,
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    '["Clima central inverter", "Cochera triple", "Cocina integral equipada", "Jardín privado"]'::jsonb,
    4,
    4,
    380,
    2
),
(
    'Lote Residencial en Querétaro',
    'Terreno listo para construir dentro de clúster con campo de golf, servicios subterráneos y club deportivo familiar.',
    95000,
    'Querétaro',
    'Querétaro',
    '76230',
    'Juriquilla',
    'Circuito del Parque 12',
    'terreno',
    'compra',
    false,
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    '["Servicios a pie de lote", "Seguridad 24/7", "Casa club con alberca", "Área comercial cercana"]'::jsonb,
    0,
    0,
    300,
    0
);
