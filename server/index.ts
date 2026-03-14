import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { login, signup, getSession } from "./routes/auth";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./routes/products";
import {
  getMessages,
  getMessage,
  createMessage,
  markMessageAsRead,
  deleteMessage,
  getStats,
} from "./routes/messages";
import {
  getContent,
  getContentBlock,
  updateContent,
  createContent,
  deleteContent,
} from "./routes/content";
import {
  getProductMedia,
  addProductMedia,
  deleteProductMedia,
  reorderProductMedia,
  bulkAddProductMedia,
} from "./routes/product-media";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./routes/users";
import { createDemoUsers } from "./routes/demo-users";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth API
  app.post("/api/auth/login", login);
  app.post("/api/auth/signup", signup);
  app.get("/api/auth/session", getSession);

  // Products API
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProduct);
  app.post("/api/products", createProduct);
  app.put("/api/products/:id", updateProduct);
  app.delete("/api/products/:id", deleteProduct);

  // Messages API
  app.get("/api/messages", getMessages);
  app.get("/api/messages/:id", getMessage);
  app.post("/api/messages", createMessage);
  app.put("/api/messages/:id/read", markMessageAsRead);
  app.delete("/api/messages/:id", deleteMessage);
  app.get("/api/stats", getStats);

  // Content API
  app.get("/api/content", getContent);
  app.get("/api/content/:id", getContentBlock);
  app.post("/api/content", createContent);
  app.put("/api/content/:id", updateContent);
  app.delete("/api/content/:id", deleteContent);

  // Product Media API
  app.get("/api/products/:productId/media", getProductMedia);
  app.post("/api/products/media", addProductMedia);
  app.post("/api/products/media/bulk", bulkAddProductMedia);
  app.delete("/api/products/media/:mediaId", deleteProductMedia);
  app.put("/api/products/media/reorder", reorderProductMedia);

  // Users API
  app.get("/api/users", getUsers);
  app.get("/api/users/:id", getUserById);
  app.post("/api/users", createUser);
  app.put("/api/users/:id", updateUser);
  app.delete("/api/users/:id", deleteUser);

  // Demo Users API (development only)
  app.post("/api/admin/create-demo-users", createDemoUsers);

  return app;
}
