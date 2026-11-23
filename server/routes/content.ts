import { RequestHandler } from "express";
import { ContentBlock } from "@shared/api";
import { supabase, supabaseAdmin } from "../lib/supabase";

let inMemoryContentBlocks: ContentBlock[] = [
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
    value: "Venta y renta de casas, comercios, salones de fiestas, trámites de IMSS y asesoría legal con fe notarial.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hero-cta",
    section: "hero",
    key: "ctaText",
    value: "Consultar Propiedades y Trámites",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "legal-banner",
    section: "legal",
    key: "bannerNotice",
    value: "Actualización 2026: Nuevos convenios consulares para poderes notariales y pensiones IMSS en EE. UU.",
    updatedAt: new Date().toISOString(),
  },
];

export const getContent: RequestHandler = async (req, res) => {
  const { section } = req.query;

  try {
    let query = supabase.from("site_content").select("*");
    if (section) {
      query = query.eq("section", section);
    }
    const { data, error } = await query;

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = data.map((d: any) => ({
        id: d.id,
        section: d.section,
        key: d.key,
        value: typeof d.value === "string" ? d.value : d.value,
        updatedAt: d.updated_at,
      }));
      return res.json(mapped);
    }
  } catch (e) {
    console.warn("Supabase site_content fallback:", e);
  }

  const filtered = section
    ? inMemoryContentBlocks.filter((c) => c.section === section)
    : inMemoryContentBlocks;
  return res.json(filtered);
};

export const getContentBlock: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return res.json({
        id: data.id,
        section: data.section,
        key: data.key,
        value: data.value,
        updatedAt: data.updated_at,
      });
    }
  } catch (e) {}

  const block = inMemoryContentBlocks.find((c) => c.id === id);
  if (!block) {
    return res.status(404).json({ error: "Bloque de contenido no encontrado" });
  }
  return res.json(block);
};

export const updateContent: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { value, section, key } = req.body;

  if (value === undefined) {
    return res.status(400).json({ error: "El valor es requerido" });
  }

  try {
    const { data, error } = await supabaseAdmin
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

    if (!error && data) {
      return res.json({
        id: data.id,
        section: data.section,
        key: data.key,
        value: data.value,
        updatedAt: data.updated_at,
      });
    }
  } catch (e) {
    console.error("Error upserting site_content in Supabase:", e);
  }

  const blockIndex = inMemoryContentBlocks.findIndex((c) => c.id === id);
  if (blockIndex === -1) {
    const newBlock: ContentBlock = {
      id,
      section: section || "general",
      key: key || id,
      value,
      updatedAt: new Date().toISOString(),
    };
    inMemoryContentBlocks.push(newBlock);
    return res.json(newBlock);
  }

  inMemoryContentBlocks[blockIndex] = {
    ...inMemoryContentBlocks[blockIndex],
    value,
    updatedAt: new Date().toISOString(),
  };
  return res.json(inMemoryContentBlocks[blockIndex]);
};

export const createContent: RequestHandler = async (req, res) => {
  const { section, key, value } = req.body;

  if (!section || !key || value === undefined) {
    return res.status(400).json({ error: "section, key y value son requeridos" });
  }

  const id = `${section}-${key}`;

  try {
    const { data, error } = await supabaseAdmin
      .from("site_content")
      .upsert({
        id,
        section,
        key,
        value,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error && data) {
      return res.status(201).json({
        id: data.id,
        section: data.section,
        key: data.key,
        value: data.value,
        updatedAt: data.updated_at,
      });
    }
  } catch (e) {
    console.error("Error creating content in Supabase:", e);
  }

  const newBlock: ContentBlock = {
    id,
    section,
    key,
    value,
    updatedAt: new Date().toISOString(),
  };

  inMemoryContentBlocks.push(newBlock);
  return res.status(201).json(newBlock);
};

export const deleteContent: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await supabaseAdmin.from("site_content").delete().eq("id", id);
  } catch (e) {}

  inMemoryContentBlocks = inMemoryContentBlocks.filter((c) => c.id !== id);
  return res.json({ success: true, id });
};
