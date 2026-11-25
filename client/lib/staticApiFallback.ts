import { supabase } from "./supabase";
import { ContentBlock, LegalArticle, Product } from "@shared/api";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mapProductRow(row: any): Product {
  return {
    id: String(row.id),
    name: row.name || "",
    description: row.description || "",
    price: Number(row.price || 0),
    city: row.city || "",
    state: row.state || undefined,
    postalCode: row.postal_code || undefined,
    neighborhood: row.neighborhood || undefined,
    address: row.address || undefined,
    streetType: row.street_type || undefined,
    streetName: row.street_name || undefined,
    exteriorNumber: row.exterior_number || undefined,
    interiorNumber: row.interior_number || undefined,
    locality: row.locality || undefined,
    latitude: row.latitude !== null && row.latitude !== undefined ? Number(row.latitude) : undefined,
    longitude:
      row.longitude !== null && row.longitude !== undefined ? Number(row.longitude) : undefined,
    type: row.type || "casa",
    category: row.category || "compra",
    isCommercial: Boolean(row.is_commercial),
    capacity: row.capacity !== null && row.capacity !== undefined ? Number(row.capacity) : undefined,
    rentalPeriod: row.rental_period || undefined,
    image: row.main_image_url || row.image || "",
    features: Array.isArray(row.features) ? row.features : [],
    bedrooms: row.bedrooms || 0,
    bathrooms: row.bathrooms || 0,
    area: row.area || 0,
    floors: row.floors || 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function mapProductPayloadToRow(body: any, isUpdate = false) {
  const row: Record<string, any> = {
    name: body.name,
    description: body.description,
    price: Number(body.price),
    city: body.city,
    state: body.state ?? null,
    postal_code: body.postalCode ?? null,
    neighborhood: body.neighborhood ?? null,
    address: body.address ?? null,
    street_type: body.streetType ?? null,
    street_name: body.streetName ?? null,
    exterior_number: body.exteriorNumber ?? null,
    interior_number: body.interiorNumber ?? null,
    locality: body.locality ?? null,
    latitude: body.latitude ? Number(body.latitude) : null,
    longitude: body.longitude ? Number(body.longitude) : null,
    type: body.type,
    category: body.category,
    is_commercial: Boolean(body.isCommercial),
    capacity:
      body.capacity !== undefined ? (body.capacity ? Number(body.capacity) : null) : null,
    rental_period:
      body.rentalPeriod !== undefined
        ? body.rentalPeriod
        : body.category === "renta"
          ? "mensual"
          : null,
    main_image_url: body.image || null,
    features: Array.isArray(body.features) ? body.features : [],
    bedrooms: body.bedrooms || 0,
    bathrooms: body.bathrooms || 0,
    area: body.area || 0,
    floors: body.floors || 0,
  };
  if (isUpdate) {
    row.updated_at = new Date().toISOString();
  }
  return row;
}

function dataUrlToBlob(dataUrl: string): { blob: Blob; mime: string; ext: string } | null {
  const match = dataUrl.match(/^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/);
  if (!match) return null;

  const mime = match[1].toLowerCase();
  const allowedMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "video/webm": "webm",
  };

  const ext = allowedMap[mime];
  if (!ext) return null;

  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return {
    blob: new Blob([bytes], { type: mime }),
    mime,
    ext,
  };
}

const DEFAULT_CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "hero-title",
    section: "hero",
    key: "title",
    value: "Invierte. Protege. Regresa. Tu patrimonio en México seguro desde EE. UU.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hero-subtitle",
    section: "hero",
    key: "subtitle",
    value:
      "Venta y renta de casas, comercios, salones de fiestas, trámites de IMSS y asesoría legal con fe notarial.",
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_LEGAL_ARTICLES: LegalArticle[] = [
  {
    id: "1",
    title: "Reforma a Leyes Notariales y Poderes Consulares para Paisanos",
    category: "notarial",
    summary: "Cómo otorgar poderes notariales válidos en México desde los consulados en EE. UU. sin viajar.",
    content:
      "Los ciudadanos mexicanos que residen en EE. UU. pueden otorgar poderes notariales de pleitos y cobranzas o de dominio ante su consulado mexicano más cercano. Este poder tiene plena validez jurídica ante cualquier notario en la República Mexicana.",
    importantNotice:
      "Asegúrate de llevar tu pasaporte mexicano vigente o matrícula consular y copia de las escrituras del inmueble.",
    published: true,
    order: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Modalidad 40 del IMSS: Reactiva y Maximiza tu Pensión desde el Extranjero",
    category: "imss",
    summary: "Reglas vigentes para registrarte y aportar semanas cotizadas viviendo en Estados Unidos.",
    content:
      "Si cotizaste al IMSS antes del 1 de julio de 1997 (Ley 73), puedes inscribirte en la Continuación Voluntaria al Régimen Obligatorio (Modalidad 40) para mejorar tu salario base de cotización y obtener una pensión de hasta 25 UMAS mensuales.",
    importantNotice: "No dejes pasar más de 5 años desde tu última baja laboral en México sin reactivarte.",
    published: true,
    order: 2,
    updatedAt: new Date().toISOString(),
  },
];

function parseBody(init?: RequestInit): any {
  if (!init?.body || typeof init.body !== "string") return {};
  try {
    return JSON.parse(init.body);
  } catch {
    return {};
  }
}

/**
 * Resuelve llamadas /api/* directamente contra Supabase cuando la app
 * corre en un hosting estático sin servidor Node/Express.
 */
export async function handleStaticSupabaseApi(
  rawUrl: string,
  init: RequestInit = {}
): Promise<Response | null> {
  const parsedUrl = new URL(rawUrl, window.location.origin);
  const path = parsedUrl.pathname.replace(/\/+$/, "");
  const method = (init.method || "GET").toUpperCase();
  const body = parseBody(init);

  // 1. Subida y borrado de imágenes/videos en Supabase Storage
  if (path === "/api/upload/image") {
    if (method === "POST") {
      const parsed = dataUrlToBlob(body.imageData || "");
      if (!parsed) {
        return jsonResponse(
          { error: "Formato no permitido. Usa imágenes JPG, PNG, WEBP o video MP4/WEBM." },
          400
        );
      }

      const maxBytes = parsed.mime.startsWith("video/") ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (parsed.blob.size > maxBytes) {
        return jsonResponse({ error: "El archivo excede el tamaño máximo permitido." }, 400);
      }

      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const storagePath = `products/${uniqueSuffix}.${parsed.ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(storagePath, parsed.blob, {
          contentType: parsed.mime,
          cacheControl: "31536000",
          upsert: false,
        });

      if (error) {
        return jsonResponse({ error: error.message || "Error al subir el archivo a Storage" }, 400);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(storagePath);

      return jsonResponse({ url: publicUrl, path: storagePath, success: true });
    }

    if (method === "DELETE") {
      const storagePath = String(body.path || "");
      if (!/^products\/[a-zA-Z0-9_\-.]+$/.test(storagePath) || storagePath.includes("..")) {
        return jsonResponse({ error: "Ruta de archivo no permitida" }, 400);
      }
      const { error } = await supabase.storage.from("product-images").remove([storagePath]);
      if (error) {
        return jsonResponse({ error: error.message }, 400);
      }
      return jsonResponse({ success: true });
    }
  }

  // 2. Medios adicionales de productos (/api/products/:productId/media y /api/products/media...)
  const productMediaMatch = path.match(/^\/api\/products\/([^/]+)\/media$/);
  if (productMediaMatch && method === "GET") {
    const productId = productMediaMatch[1];
    const page = Math.max(1, parseInt(parsedUrl.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, parseInt(parsedUrl.searchParams.get("limit") || "50", 10));
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("product_media")
      .select("*", { count: "exact" })
      .eq("product_id", productId)
      .order("display_order", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) return jsonResponse({ error: error.message }, 400);

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    return jsonResponse({
      data: data || [],
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  }

  if (path === "/api/products/media" && method === "POST") {
    const { productId, mediaType, mediaUrl, storagePath } = body;
    const { data: existing } = await supabase
      .from("product_media")
      .select("display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: false })
      .limit(1);

    const displayOrder = (existing?.[0]?.display_order ?? -1) + 1;
    const { data, error } = await supabase
      .from("product_media")
      .insert([
        {
          product_id: productId,
          media_type: mediaType,
          media_url: mediaUrl,
          storage_path: storagePath,
          display_order: displayOrder,
        },
      ])
      .select()
      .single();

    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse(data, 201);
  }

  if (path === "/api/products/media/bulk" && method === "POST") {
    const { productId, mediaItems } = body;
    if (!productId || !Array.isArray(mediaItems) || mediaItems.length === 0) {
      return jsonResponse({ error: "Campos requeridos faltantes" }, 400);
    }
    const { data: existing } = await supabase
      .from("product_media")
      .select("display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: false })
      .limit(1);

    const startOrder = (existing?.[0]?.display_order ?? -1) + 1;
    const rows = mediaItems.map((item: any, idx: number) => ({
      product_id: productId,
      media_type: item.mediaType,
      media_url: item.mediaUrl,
      storage_path: item.storagePath,
      display_order: startOrder + idx,
    }));

    const { data, error } = await supabase.from("product_media").insert(rows).select();
    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse({ message: `${data.length} archivos agregados`, data }, 201);
  }

  if (path === "/api/products/media/reorder" && method === "PUT") {
    const { mediaId, newOrder } = body;
    const { data, error } = await supabase
      .from("product_media")
      .update({ display_order: newOrder })
      .eq("id", mediaId)
      .select()
      .single();

    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse(data);
  }

  const deleteMediaMatch = path.match(/^\/api\/products\/media\/([^/]+)$/);
  if (deleteMediaMatch && method === "DELETE") {
    const mediaId = deleteMediaMatch[1];
    const { data, error } = await supabase
      .from("product_media")
      .delete()
      .eq("id", mediaId)
      .select()
      .single();

    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse(data);
  }

  // 3. Productos (/api/products y /api/products/:id)
  if (path === "/api/products") {
    if (method === "GET") {
      const page = Math.max(1, parseInt(parsedUrl.searchParams.get("page") || "1", 10));
      const limit = Math.min(100, parseInt(parsedUrl.searchParams.get("limit") || "20", 10));
      const search = (parsedUrl.searchParams.get("search") || "").trim();
      const category = (parsedUrl.searchParams.get("category") || "").trim();
      const type = (parsedUrl.searchParams.get("type") || "").trim();
      const offset = (page - 1) * limit;

      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      if (type && type !== "all") {
        query = query.eq("type", type);
      }
      if (search) {
        const cleanSearch = search.replace(/[%_,]/g, "");
        if (cleanSearch) {
          query = query.or(
            `name.ilike.%${cleanSearch}%,city.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`
          );
        }
      }

      const { data, error, count } = await query.range(offset, offset + limit - 1);
      if (error) return jsonResponse({ error: error.message }, 400);

      const total = count || 0;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      return jsonResponse({
        data: (data || []).map(mapProductRow),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    }

    if (method === "POST") {
      const { data, error } = await supabase
        .from("products")
        .insert([mapProductPayloadToRow(body, false)])
        .select()
        .single();

      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse(mapProductRow(data), 201);
    }
  }

  const singleProductMatch = path.match(/^\/api\/products\/([^/]+)$/);
  if (singleProductMatch && singleProductMatch[1] !== "media") {
    const productId = singleProductMatch[1];

    if (method === "GET") {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error || !data) return jsonResponse({ error: "Producto no encontrado" }, 404);
      return jsonResponse(mapProductRow(data));
    }

    if (method === "PUT") {
      const { data, error } = await supabase
        .from("products")
        .update(mapProductPayloadToRow(body, true))
        .eq("id", productId)
        .select()
        .single();

      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse(mapProductRow(data));
    }

    if (method === "DELETE") {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .select()
        .single();

      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse(mapProductRow(data));
    }
  }

  // 4. Estadísticas y Mensajes (/api/stats y /api/messages...)
  if (path === "/api/stats" && method === "GET") {
    const { data, error } = await supabase.from("contact_messages").select("read");
    if (error) {
      return jsonResponse({ totalMessages: 0, unreadMessages: 0 });
    }
    const rows = data || [];
    return jsonResponse({
      totalMessages: rows.length,
      unreadMessages: rows.filter((m: any) => !m.read).length,
    });
  }

  if (path === "/api/messages" || path === "/api/contact") {
    if (method === "GET") {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return jsonResponse([], 200);
      return jsonResponse(
        (data || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          whatsapp: m.whatsapp,
          email: m.email,
          city: m.city || "",
          message: m.message || "",
          createdAt: m.created_at,
          read: Boolean(m.read),
        }))
      );
    }

    if (method === "POST") {
      if (body._honeypot) {
        return jsonResponse({ id: "ok", message: "Mensaje recibido", emailSent: true }, 201);
      }
      const { name, whatsapp, email, city, message } = body;
      if (!name || !whatsapp || !email || !city) {
        return jsonResponse({ error: "Campos requeridos faltantes" }, 400);
      }

      const cleanPayload = {
        name: String(name).trim().slice(0, 100),
        whatsapp: String(whatsapp).trim().slice(0, 30),
        email: String(email).trim().toLowerCase().slice(0, 100),
        city: String(city).trim().slice(0, 100),
        message: typeof message === "string" ? message.trim().slice(0, 2000) : "",
      };

      const { error } = await supabase.from("contact_messages").insert([
        {
          ...cleanPayload,
          read: false,
        },
      ]);

      // Disparar envío SMTP en Hostinger Web Hosting si el endpoint PHP está disponible
      let phpEmailOk = false;
      try {
        const phpRes = await window.fetch("/api/contact.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanPayload),
        });
        const ct = phpRes.headers.get("content-type") || "";
        if (phpRes.ok && ct.includes("application/json")) {
          phpEmailOk = true;
        }
      } catch {
        // Ignorar si no hay runtime PHP
      }

      if (error && !phpEmailOk) return jsonResponse({ error: error.message }, 400);
      return jsonResponse(
        { id: "ok", message: "Mensaje enviado correctamente", emailSent: phpEmailOk },
        201
      );
    }
  }

  const readMessageMatch = path.match(/^\/api\/messages\/([^/]+)\/read$/);
  if (readMessageMatch && method === "PUT") {
    const id = readMessageMatch[1];
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ read: true })
      .eq("id", id)
      .select()
      .single();

    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse({
      id: data.id,
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email,
      city: data.city,
      message: data.message,
      createdAt: data.created_at,
      read: Boolean(data.read),
    });
  }

  const singleMessageMatch = path.match(/^\/api\/messages\/([^/]+)$/);
  if (singleMessageMatch) {
    const id = singleMessageMatch[1];
    if (method === "DELETE") {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse({ success: true, id });
    }
  }

  // 5. Bloques de contenido (/api/content...)
  if (path === "/api/content") {
    if (method === "GET") {
      const section = parsedUrl.searchParams.get("section");
      let query = supabase.from("site_content").select("*");
      if (section) query = query.eq("section", section);
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return jsonResponse(
          data.map((d: any) => ({
            id: d.id,
            section: d.section,
            key: d.key,
            value: d.value,
            updatedAt: d.updated_at,
          }))
        );
      }
      return jsonResponse(
        section
          ? DEFAULT_CONTENT_BLOCKS.filter((c) => c.section === section)
          : DEFAULT_CONTENT_BLOCKS
      );
    }

    if (method === "POST") {
      const { section, key, value } = body;
      const id = `${section}-${key}`;
      const { data, error } = await supabase
        .from("site_content")
        .upsert({ id, section, key, value, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse(
        { id: data.id, section: data.section, key: data.key, value: data.value, updatedAt: data.updated_at },
        201
      );
    }
  }

  const singleContentMatch = path.match(/^\/api\/content\/([^/]+)$/);
  if (singleContentMatch) {
    const id = singleContentMatch[1];
    if (method === "PUT") {
      const { value, section, key } = body;
      const { data, error } = await supabase
        .from("site_content")
        .upsert({
          id,
          section: section || "general",
          key: key || id,
          value,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse({
        id: data.id,
        section: data.section,
        key: data.key,
        value: data.value,
        updatedAt: data.updated_at,
      });
    }
    if (method === "DELETE") {
      const { error } = await supabase.from("site_content").delete().eq("id", id);
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse({ success: true, id });
    }
  }

  // 6. Artículos legales (/api/legal-articles...)
  if (path === "/api/legal-articles") {
    if (method === "GET") {
      const category = parsedUrl.searchParams.get("category");
      const onlyPublished = parsedUrl.searchParams.get("onlyPublished");
      let query = supabase
        .from("legal_articles")
        .select("*")
        .order("display_order", { ascending: true });
      if (category && category !== "all") query = query.eq("category", category);
      if (onlyPublished === "true") query = query.eq("published", true);
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return jsonResponse(
          data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            summary: item.summary,
            content: item.content,
            importantNotice: item.important_notice,
            published: item.published,
            order: item.display_order || 0,
            updatedAt: item.updated_at,
          }))
        );
      }
      return jsonResponse(DEFAULT_LEGAL_ARTICLES);
    }

    if (method === "POST") {
      const { title, category, summary, content, importantNotice, published, order } = body;
      const { data, error } = await supabase
        .from("legal_articles")
        .insert([
          {
            title,
            category,
            summary: summary || "",
            content,
            important_notice: importantNotice || null,
            published: published !== undefined ? published : true,
            display_order: order ? Number(order) : 0,
          },
        ])
        .select()
        .single();
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse(
        {
          id: data.id,
          title: data.title,
          category: data.category,
          summary: data.summary,
          content: data.content,
          importantNotice: data.important_notice,
          published: data.published,
          order: data.display_order,
          updatedAt: data.updated_at,
        },
        201
      );
    }
  }

  const singleLegalMatch = path.match(/^\/api\/legal-articles\/([^/]+)$/);
  if (singleLegalMatch) {
    const id = singleLegalMatch[1];
    if (method === "PUT") {
      const { title, category, summary, content, importantNotice, published, order } = body;
      const { data, error } = await supabase
        .from("legal_articles")
        .update({
          title,
          category,
          summary,
          content,
          important_notice: importantNotice,
          published,
          display_order: order !== undefined ? Number(order) : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse({
        id: data.id,
        title: data.title,
        category: data.category,
        summary: data.summary,
        content: data.content,
        importantNotice: data.important_notice,
        published: data.published,
        order: data.display_order,
        updatedAt: data.updated_at,
      });
    }
    if (method === "DELETE") {
      const { error } = await supabase.from("legal_articles").delete().eq("id", id);
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse({ success: true, id });
    }
  }

  // 7. Gestión de perfiles de usuario (/api/users...)
  if (path === "/api/users") {
    if (method === "GET") {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, email, role, created_at, updated_at")
        .order("created_at", { ascending: false });
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse(data || []);
    }
    if (method === "POST") {
      return jsonResponse(
        {
          error:
            "Por seguridad, el alta de nuevas cuentas debe hacerse desde el entorno local o el panel de Supabase Auth.",
        },
        403
      );
    }
  }

  const singleUserMatch = path.match(/^\/api\/users\/([^/]+)$/);
  if (singleUserMatch) {
    const id = singleUserMatch[1];
    if (method === "PUT") {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({ role: body.role, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse(data);
    }
    if (method === "DELETE") {
      const { error } = await supabase.from("user_profiles").delete().eq("id", id);
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse({ message: "Perfil eliminado" });
    }
  }

  return null;
}
