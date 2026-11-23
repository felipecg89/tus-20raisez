import { RequestHandler } from "express";
import { LegalArticle } from "@shared/api";
import { supabase, supabaseAdmin } from "../lib/supabase";

// Fallback seed articles in case Supabase is syncing
export const FALLBACK_LEGAL_ARTICLES: LegalArticle[] = [
  {
    id: "1",
    title: "Reforma a Leyes Notariales y Poderes Consulares para Paisanos",
    category: "notarial",
    summary: "Cómo otorgar poderes notariales válidos en México desde los consulados en EE. UU. sin viajar.",
    content: "Los ciudadanos mexicanos que residen en EE. UU. pueden otorgar poderes notariales de pleitos y cobranzas o de dominio ante su consulado mexicano más cercano. Este poder tiene plena validez jurídica ante cualquier notario en la República Mexicana.",
    importantNotice: "Asegúrate de llevar tu pasaporte mexicano vigente o matrícula consular y copia de las escrituras del inmueble.",
    published: true,
    order: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Modalidad 40 del IMSS: Reactiva y Maximiza tu Pensión desde el Extranjero",
    category: "imss",
    summary: "Reglas vigentes para registrarte y aportar semanas cotizadas viviendo en Estados Unidos.",
    content: "Si cotizaste al IMSS antes del 1 de julio de 1997 (Ley 73), puedes inscribirte en la Continuación Voluntaria al Régimen Obligatorio (Modalidad 40) para mejorar tu salario base de cotización y obtener una pensión de hasta 25 UMAS mensuales.",
    importantNotice: "No dejes pasar más de 5 años desde tu última baja laboral en México sin reactivarte.",
    published: true,
    order: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Infonavit Sin Fronteras: Compra y Paga tu Vivienda en Dólares",
    category: "infonavit",
    summary: "Paga el crédito de tu familiar o adquiere tu propia casa enviando remesas directas sin comisiones.",
    content: "A través de remesadoras aliadas, puedes pagar el crédito Infonavit de un familiar o utilizar tu Subcuenta de Vivienda acumulada para comprar una propiedad nueva o usada en territorio nacional.",
    importantNotice: "Infonavit absorbe el costo de la comisión por envío de la remesa en las remesadoras participantes.",
    published: true,
    order: 3,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Juicios Sucesorios y Testamentos Binacionales",
    category: "ley",
    summary: "Qué hacer cuando una propiedad en México quedó intestada o los herederos viven en EE. UU.",
    content: "La ley mexicana permite tramitar juicios intestamentarios o sucesorios de manera notarial si todos los herederos están de acuerdo y son mayores de edad, nombrando un apoderado legal en México.",
    importantNotice: "Contar con un poder consular redactado específicamente para el trámite sucesorio evita traslados innecesarios.",
    published: true,
    order: 4,
    updatedAt: new Date().toISOString(),
  },
];

let inMemoryArticles = [...FALLBACK_LEGAL_ARTICLES];

/**
 * GET /api/legal-articles
 */
export const getLegalArticles: RequestHandler = async (req, res) => {
  const { category, onlyPublished } = req.query;

  try {
    let query = supabase.from("legal_articles").select("*").order("display_order", { ascending: true });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (onlyPublished === "true") {
      query = query.eq("published", true);
    }

    const { data, error } = await query;

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        summary: item.summary,
        content: item.content,
        importantNotice: item.important_notice,
        published: item.published,
        order: item.display_order || 0,
        updatedAt: item.updated_at,
      }));
      return res.json(mapped);
    }
  } catch (e) {
    console.warn("Supabase legal_articles query fallback:", e);
  }

  // Fallback in-memory
  let result = [...inMemoryArticles];
  if (category && category !== "all") {
    result = result.filter((a) => a.category === category);
  }
  if (onlyPublished === "true") {
    result = result.filter((a) => a.published);
  }
  return res.json(result);
};

/**
 * POST /api/legal-articles
 */
export const createLegalArticle: RequestHandler = async (req, res) => {
  const { title, category, summary, content, importantNotice, published, order } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ error: "Título, categoría y contenido son requeridos" });
  }

  try {
    const { data, error } = await supabaseAdmin
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

    if (!error && data) {
      return res.status(201).json({
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
  } catch (e) {
    console.error("Error inserting legal article to Supabase:", e);
  }

  // Fallback
  const newArticle: LegalArticle = {
    id: Date.now().toString(),
    title,
    category,
    summary: summary || "",
    content,
    importantNotice,
    published: published !== undefined ? published : true,
    order: order ? Number(order) : inMemoryArticles.length + 1,
    updatedAt: new Date().toISOString(),
  };

  inMemoryArticles.unshift(newArticle);
  return res.status(201).json(newArticle);
};

/**
 * PUT /api/legal-articles/:id
 */
export const updateLegalArticle: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, category, summary, content, importantNotice, published, order } = req.body;

  try {
    const { data, error } = await supabaseAdmin
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

    if (!error && data) {
      return res.json({
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
  } catch (e) {
    console.error("Error updating legal article in Supabase:", e);
  }

  // Fallback
  const index = inMemoryArticles.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Artículo no encontrado" });
  }

  inMemoryArticles[index] = {
    ...inMemoryArticles[index],
    title: title ?? inMemoryArticles[index].title,
    category: category ?? inMemoryArticles[index].category,
    summary: summary ?? inMemoryArticles[index].summary,
    content: content ?? inMemoryArticles[index].content,
    importantNotice: importantNotice ?? inMemoryArticles[index].importantNotice,
    published: published ?? inMemoryArticles[index].published,
    order: order !== undefined ? Number(order) : inMemoryArticles[index].order,
    updatedAt: new Date().toISOString(),
  };

  return res.json(inMemoryArticles[index]);
};

/**
 * DELETE /api/legal-articles/:id
 */
export const deleteLegalArticle: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin.from("legal_articles").delete().eq("id", id);
    if (!error) {
      return res.json({ success: true, id });
    }
  } catch (e) {
    console.error("Error deleting legal article from Supabase:", e);
  }

  inMemoryArticles = inMemoryArticles.filter((a) => a.id !== id);
  return res.json({ success: true, id });
};
