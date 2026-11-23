import "dotenv/config";
import express from "express";
import cors from "cors";
import { requireAuth, requireAdminOrAgent, requireAdmin } from "./middleware/auth";
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
import { uploadImage, deleteImage } from "./routes/upload";
import {
  getLegalArticles,
  createLegalArticle,
  updateLegalArticle,
  deleteLegalArticle,
} from "./routes/legal-articles";

export function createServer() {
  const app = express();

  // Seguridad: Ocultar fingerprint del servidor
  app.disable("x-powered-by");

  // Middleware con límites de carga seguros
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Health API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Auth API (Público)
  app.post("/api/auth/login", login);
  app.post("/api/auth/signup", signup);
  app.get("/api/auth/session", getSession);

  // Upload API (Protegido para agentes y administradores)
  app.post("/api/upload/image", requireAuth, requireAdminOrAgent, uploadImage);
  app.delete("/api/upload/image", requireAuth, requireAdminOrAgent, deleteImage);

  // Products API (Lectura pública, modificación protegida)
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProduct);
  app.post("/api/products", requireAuth, requireAdminOrAgent, createProduct);
  app.put("/api/products/:id", requireAuth, requireAdminOrAgent, updateProduct);
  app.delete("/api/products/:id", requireAuth, requireAdminOrAgent, deleteProduct);

  // Messages API (Creación pública desde formularios web; lectura y gestión protegida)
  app.post("/api/messages", createMessage);
  app.get("/api/messages", requireAuth, requireAdminOrAgent, getMessages);
  app.get("/api/messages/:id", requireAuth, requireAdminOrAgent, getMessage);
  app.put("/api/messages/:id/read", requireAuth, requireAdminOrAgent, markMessageAsRead);
  app.delete("/api/messages/:id", requireAuth, requireAdminOrAgent, deleteMessage);
  app.get("/api/stats", requireAuth, requireAdminOrAgent, getStats);

  // Content API (Lectura pública; edición protegida)
  app.get("/api/content", getContent);
  app.get("/api/content/:id", getContentBlock);
  app.post("/api/content", requireAuth, requireAdminOrAgent, createContent);
  app.put("/api/content/:id", requireAuth, requireAdminOrAgent, updateContent);
  app.delete("/api/content/:id", requireAuth, requireAdminOrAgent, deleteContent);

  // Product Media API (Lectura pública; edición protegida)
  app.get("/api/products/:productId/media", getProductMedia);
  app.post("/api/products/media", requireAuth, requireAdminOrAgent, addProductMedia);
  app.post("/api/products/media/bulk", requireAuth, requireAdminOrAgent, bulkAddProductMedia);
  app.delete("/api/products/media/:mediaId", requireAuth, requireAdminOrAgent, deleteProductMedia);
  app.put("/api/products/media/reorder", requireAuth, requireAdminOrAgent, reorderProductMedia);

  // Users API (Exclusivo para administradores)
  app.get("/api/users", requireAuth, requireAdmin, getUsers);
  app.get("/api/users/:id", requireAuth, requireAdmin, getUserById);
  app.post("/api/users", requireAuth, requireAdmin, createUser);
  app.put("/api/users/:id", requireAuth, requireAdmin, updateUser);
  app.delete("/api/users/:id", requireAuth, requireAdmin, deleteUser);

  // Legal Articles & Law Changes API (Lectura pública; edición protegida)
  app.get("/api/legal-articles", getLegalArticles);
  app.post("/api/legal-articles", requireAuth, requireAdminOrAgent, createLegalArticle);
  app.put("/api/legal-articles/:id", requireAuth, requireAdminOrAgent, updateLegalArticle);
  app.delete("/api/legal-articles/:id", requireAuth, requireAdminOrAgent, deleteLegalArticle);

  return app;
}
