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

export const signup: RequestHandler = async (req, res) => {
  try {
    const { email, password, role = "cliente" } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // Create user in auth using regular client
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({
        error: authError.message || "Failed to create user",
      });
    }

    if (!authData.user) {
      return res.status(500).json({
        error: "Failed to create user",
      });
    }

    // Create user profile using admin client
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        email,
        role,
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id).catch(() => {});
      return res.status(500).json({
        error: "Failed to create user profile",
      });
    }

    // Sign in the new user
    const { data: sessionData, error: sessionError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (sessionError || !sessionData.session) {
      return res.status(500).json({
        error: "Failed to create session",
      });
    }

    return res.json({
      user: {
        id: authData.user.id,
        email,
        role,
      },
      session: {
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        expires_at: sessionData.session.expires_at,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
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
    } = await supabaseAdmin.auth.admin.getUserById(token);

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
