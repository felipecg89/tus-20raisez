import { RequestHandler } from "express";
import { supabaseAdmin, supabase } from "../lib/supabase";

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Use regular client for authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        error: error.message || "Invalid credentials",
      });
    }

    if (!data.user || !data.session) {
      return res.status(500).json({
        error: "Failed to authenticate",
      });
    }

    // Fetch user profile with role
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      return res.status(500).json({
        error: "Failed to fetch user profile",
      });
    }

    return res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profileData?.role || "cliente",
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const signup: RequestHandler = async (_req, res) => {
  return res.status(403).json({
    error: "El registro público está deshabilitado. Solo un administrador puede dar de alta cuentas.",
  });
};

export const getSession: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.slice(7);

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch user profile
    const { data: profileData } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        role: profileData?.role || "cliente",
      },
    });
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
