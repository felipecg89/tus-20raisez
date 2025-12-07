import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ajnenxygedrazpvjdbdo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbmVueHlnZWRyYXpwdmpkYmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNjg3NzgsImV4cCI6MjA4MDY0NDc3OH0.TQ3eoWUZWncx9EHt_T1oZruTVVQmXtrztyc8ZHC64RY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getProductMedia: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.params;

    const { data, error } = await supabase
      .from("product_media")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    console.error("Error fetching product media:", error);
    res.status(500).json({ error: "Error al obtener medios del producto" });
  }
};

export const addProductMedia: RequestHandler = async (req, res) => {
  try {
    const { productId, mediaType, mediaUrl, storagePath } = req.body;

    if (!productId || !mediaType || !mediaUrl || !storagePath) {
      res.status(400).json({ error: "Campos requeridos faltantes" });
      return;
    }

    // Get current max order
    const { data: existingMedia } = await supabase
      .from("product_media")
      .select("display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: false })
      .limit(1);

    const displayOrder = (existingMedia?.[0]?.display_order ?? -1) + 1;

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

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error("Error adding product media:", error);
    res.status(500).json({ error: "Error al agregar medio" });
  }
};

export const deleteProductMedia: RequestHandler = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const { data, error } = await supabase
      .from("product_media")
      .delete()
      .eq("id", mediaId)
      .select()
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Medio no encontrado" });
      return;
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error deleting product media:", error);
    res.status(500).json({ error: "Error al eliminar medio" });
  }
};

export const reorderProductMedia: RequestHandler = async (req, res) => {
  try {
    const { mediaId, newOrder } = req.body;

    if (!mediaId || newOrder === undefined) {
      res.status(400).json({ error: "Campos requeridos faltantes" });
      return;
    }

    const { data, error } = await supabase
      .from("product_media")
      .update({ display_order: newOrder })
      .eq("id", mediaId)
      .select()
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Medio no encontrado" });
      return;
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error reordering product media:", error);
    res.status(500).json({ error: "Error al reordenar medios" });
  }
};
