import { RequestHandler } from "express";
import { Product } from "@shared/api";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ajnenxygedrazpvjdbdo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbmVueHlnZWRyYXpwdmpkYmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNjg3NzgsImV4cCI6MjA4MDY0NDc3OH0.TQ3eoWUZWncx9EHt_T1oZruTVVQmXtrztyc8ZHC64RY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getProducts: RequestHandler = (_req, res) => {
  res.json(products);
};

export const getProduct: RequestHandler = (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }
  res.json(product);
};

export const createProduct: RequestHandler = (req, res) => {
  const { name, description, price, city, type, image, features } = req.body;

  if (!name || !description || price === undefined || !city || !type) {
    res.status(400).json({ error: "Campos requeridos faltantes" });
    return;
  }

  const newProduct: Product = {
    id: Date.now().toString(),
    name,
    description,
    price: Number(price),
    city,
    type,
    image: image || "https://via.placeholder.com/400x300",
    features: features || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

export const updateProduct: RequestHandler = (req, res) => {
  const productIndex = products.findIndex((p) => p.id === req.params.id);
  if (productIndex === -1) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  const updatedProduct: Product = {
    ...products[productIndex],
    ...req.body,
    id: products[productIndex].id,
    createdAt: products[productIndex].createdAt,
    updatedAt: new Date().toISOString(),
  };

  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
};

export const deleteProduct: RequestHandler = (req, res) => {
  const productIndex = products.findIndex((p) => p.id === req.params.id);
  if (productIndex === -1) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);
  res.json(deletedProduct);
};
