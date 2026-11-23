-- ==============================================================================
-- ACTUALIZACIÓN SUPABASE: CPANEL INTEGRAL, SALONES DE FIESTAS, COMERCIOS Y LEYES
-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase (Tus_Raices_MX)
-- ==============================================================================

-- 1. EXTENDER TABLA PRODUCTS PARA COMERCIOS Y SALONES DE FIESTAS
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rental_period TEXT DEFAULT 'mensual';

-- 2. TABLA CONTACT_MESSAGES (Para guardar mensajes de clientes persistentemente)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT DEFAULT '',
    message TEXT DEFAULT '',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir insercion publica de mensajes de contacto"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir gestion de mensajes a admin y service_role"
    ON public.contact_messages FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'agente')
        )
        OR auth.role() = 'service_role'
    );

-- 3. TABLA SITE_CONTENT (Para textos y bloques dinamicos del sitio)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de contenido"
    ON public.site_content FOR SELECT
    USING (true);

CREATE POLICY "Permitir gestion de contenido a admin y service_role"
    ON public.site_content FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR auth.role() = 'service_role'
    );

-- 4. TABLA LEGAL_ARTICLES (Para avisos, reformas de ley, tramites IMSS y Notariales)
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

ALTER TABLE public.legal_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de articulos legales"
    ON public.legal_articles FOR SELECT
    USING (true);

CREATE POLICY "Permitir gestion de articulos legales a admin y service_role"
    ON public.legal_articles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR auth.role() = 'service_role'
    );

-- 5. DATOS SEMILLA PARA ARTÍCULOS LEGALES Y CAMBIOS EN LA LEY
INSERT INTO public.legal_articles (title, category, summary, content, important_notice, published, display_order)
VALUES
(
    'Reforma a Leyes Notariales y Poderes Consulares para Paisanos',
    'notarial',
    'Cómo otorgar poderes notariales válidos en México desde los consulados en EE. UU. sin viajar.',
    'Los ciudadanos mexicanos que residen en EE. UU. pueden otorgar poderes notariales de pleitos y cobranzas o de dominio ante su consulado mexicano más cercano. Este poder tiene plena validez jurídica ante cualquier notario en la República Mexicana.',
    'Asegúrate de llevar tu pasaporte mexicano vigente o matrícula consular y copia de las escrituras del inmueble.',
    true,
    1
),
(
    'Modalidad 40 del IMSS: Reactiva y Maximiza tu Pensión desde el Extranjero',
    'imss',
    'Reglas vigentes para registrarte y aportar semanas cotizadas viviendo en Estados Unidos.',
    'Si cotizaste al IMSS antes del 1 de julio de 1997 (Ley 73), puedes inscribirte en la Continuación Voluntaria al Régimen Obligatorio (Modalidad 40) para mejorar tu salario base de cotización y obtener una pensión de hasta 25 UMAS mensuales.',
    'No dejes pasar más de 5 años desde tu última baja laboral en México sin reactivarte.',
    true,
    2
),
(
    'Infonavit Sin Fronteras: Compra y Paga tu Vivienda en Dólares',
    'infonavit',
    'Paga el crédito de tu familiar o adquiere tu propia casa enviando remesas directas sin comisiones.',
    'A través de remesadoras aliadas, puedes pagar el crédito Infonavit de un familiar o utilizar tu Subcuenta de Vivienda acumulada para comprar una propiedad nueva o usada en territorio nacional.',
    'Infonavit absorbe el costo de la comisión por envío de la remesa en las remesadoras participantes.',
    true,
    3
),
(
    'Juicios Sucesorios y Testamentos Binacionales',
    'ley',
    'Qué hacer cuando una propiedad en México quedó intestada o los herederos viven en EE. UU.',
    'La ley mexicana permite tramitar juicios intestamentarios o sucesorios de manera notarial si todos los herederos están de acuerdo y son mayores de edad, nombrando un apoderado legal en México.',
    'Contar con un poder consular redactado específicamente para el trámite sucesorio evita traslados innecesarios.',
    true,
    4
)
ON CONFLICT DO NOTHING;

-- 6. EJEMPLOS DE SALÓN DE FIESTAS Y COMERCIO EN PRODUCTS
INSERT INTO public.products (name, description, price, city, state, postal_code, neighborhood, address, type, category, is_commercial, capacity, rental_period, main_image_url, features, area)
VALUES
(
    'Salón Campestre Los Laureles para Eventos',
    'Hermoso salón y jardín para bodas, quince años y eventos sociales. Incluye cocina industrial, área techada, jardines iluminados y estacionamiento privado.',
    1200,
    'Querétaro',
    'Querétaro',
    '76100',
    'Juriquilla Campestre',
    'Camino Real a Juriquilla 400',
    'salon_fiestas',
    'renta',
    true,
    250,
    'evento',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
    '["Capacidad 250 personas", "Área de jardín y terraza techada", "Estacionamiento para 60 autos", "Cocina para banquetes", "Permiso de sonido hasta las 2 AM"]'::jsonb,
    850
),
(
    'Local Comercial en Plaza Comercial del Río',
    'Local comercial con doble altura, cancelería de cristal templado, ideal para franquicia, restaurante o boutique.',
    1800,
    'León',
    'Guanajuato',
    '37000',
    'Zona Centro',
    'Blvd. Adolfo López Mateos 1205',
    'comercio',
    'renta',
    true,
    80,
    'mensual',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    '["Doble altura", "Estacionamiento para clientes", "Seguridad privada 24 horas", "Alto flujo peatonal y vehicular"]'::jsonb,
    140
)
ON CONFLICT DO NOTHING;
