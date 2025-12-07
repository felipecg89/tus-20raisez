import { RequestHandler } from "express";
import { Product } from "@shared/api";

// In-memory storage (in production, use a database)
let products: Product[] = [
  {
    id: "1",
    name: "Casa moderna en Monterrey",
    description: "Hermosa casa de 3 recamaras con piscina",
    price: 250000,
    city: "Monterrey",
    type: "casa",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    features: ["3 recamaras", "2 baños", "Piscina", "Jardín"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Terreno en Guadalajara",
    description: "Excelente ubicación para inversión",
    price: 150000,
    city: "Guadalajara",
    type: "terreno",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop",
    features: ["500m2", "Acceso fácil", "Zona residencial"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
