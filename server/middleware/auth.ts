import { RequestHandler } from "express";
import { supabaseAdmin } from "../lib/supabase";

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: string;
}

/**
 * Middleware que valida el token JWT de Supabase desde los headers
 */
export const requireAuth: RequestHandler = async (req: any, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Acceso denegado. Se requiere un token de autenticación válido.",
      });
    }

    const token = authHeader.slice(7);
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: "Sesión inválida o expirada. Por favor inicia sesión nuevamente.",
      });
    }

    // Consultar el rol del usuario en su perfil
    const { data: profile } = await supabaseAdmin
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email,
      role: profile?.role || "cliente",
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Error de verificación de credenciales" });
  }
};

/**
 * Middleware que verifica que el usuario sea Administrador o Agente
 */
export const requireAdminOrAgent: RequestHandler = (req: any, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "agente")) {
    return res.status(403).json({
      error: "Acceso denegado. Se requieren permisos de administrador o agente.",
    });
  }
  next();
};

/**
 * Middleware que verifica que el usuario sea exclusivamente Administrador
 */
export const requireAdmin: RequestHandler = (req: any, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "Acceso denegado. Se requieren permisos exclusivos de administrador.",
    });
  }
  next();
};
