import { RequestHandler } from "express";
import { Product } from "@shared/api";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ajnenxygedrazpvjdbdo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbmVueHlnZWRyYXpwdmpkYmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNjg3NzgsImV4cCI6MjA4MDY0NDc3OH0.TQ3eoWUZWncx9EHt_T1oZruTVVQmXtrztyc8ZHC64RY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getProducts: RequestHandler = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const offset = (page - 1) * limit;

    const city = req.query.city as string;
    const type = req.query.type as string;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

    let query = supabase.from("products").select("*", { count: "exact" });

    // Apply filters
    if (type) {
      query = query.eq("type", type);
    }
    if (category) {
      query = query.eq("category", category);
    }
    if (city) {
      query = query.ilike("city", `%${city}%`);
    }
    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const products = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      city: p.city,
      type: p.type,
      category: p.category || "venta_casa",
      image: p.main_image_url,
      features: p.features || [],
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    res.json({
      data: products,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page < Math.ceil((count || 0) / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const getProduct: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    const product: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      city: data.city,
      type: data.type,
      category: data.category || "venta_casa",
      image: data.main_image_url,
      features: data.features || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    res.json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const { name, description, price, city, type, category, image, features } = req.body;

    if (!name || !description || price === undefined || !city || !type || !category) {
      res.status(400).json({ error: "Campos requeridos faltantes" });
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price: Number(price),
          city,
          type,
          category,
          main_image_url: image || null,
          features: features || [],
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const newProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      city: data.city,
      type: data.type,
      category: data.category,
      image: data.main_image_url,
      features: data.features || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const { name, description, price, city, type, category, image, features } = req.body;

    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: Number(price),
        city,
        type,
        category,
        main_image_url: image || null,
        features: features || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    const updatedProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      city: data.city,
      type: data.type,
      category: data.category,
      image: data.main_image_url,
      features: data.features || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    res.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    const deletedProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      city: data.city,
      type: data.type,
      category: data.category,
      image: data.main_image_url,
      features: data.features || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    res.json(deletedProduct);
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
