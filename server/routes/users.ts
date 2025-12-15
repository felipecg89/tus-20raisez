import { RequestHandler } from "express";
import { supabaseAdmin } from "@/server/lib/supabase";

/**
 * GET /api/users - Obtener lista de usuarios (solo admin)
 */
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from("user_profiles")
      .select("id, email, role, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(users || []);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

/**
 * GET /api/users/:id - Obtener usuario específico
 */
export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabaseAdmin
      .from("user_profiles")
      .select("id, email, role, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
};

/**
 * PUT /api/users/:id - Actualizar usuario (cambiar rol)
 */
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validar rol
    const validRoles = ["cliente", "agente", "admin"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        error: `Rol inválido. Debe ser uno de: ${validRoles.join(", ")}`,
      });
    }

    const { data: user, error } = await supabaseAdmin
      .from("user_profiles")
      .update({
        role: role || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
};

/**
 * DELETE /api/users/:id - Eliminar usuario
 */
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Primero eliminar el perfil (esto también eliminará el usuario de auth por CASCADE)
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .delete()
      .eq("id", id);

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    // También intentar eliminar directamente de auth.users si existe
    try {
      await supabaseAdmin.auth.admin.deleteUser(id);
    } catch (authError) {
      // Si ya fue eliminado, no hay problema
      console.log("Auth user already deleted or doesn't exist");
    }

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

/**
 * POST /api/users - Crear nuevo usuario (solo admin)
 */
export const createUser: RequestHandler = async (req, res) => {
  try {
    const { email, password, role = "cliente" } = req.body;

    // Validar entrada
    if (!email || !password) {
      return res.status(400).json({
        error: "Email y contraseña son requeridos",
      });
    }

    const validRoles = ["cliente", "agente", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: `Rol inválido. Debe ser uno de: ${validRoles.join(", ")}`,
      });
    }

    // Crear usuario en auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ error: "Failed to create user" });
    }

    // Crear perfil (el trigger debería hacerlo, pero lo hacemos explícitamente)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .upsert({
        id: authData.user.id,
        email,
        role,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      // Intentar limpiar el usuario creado
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (e) {
        console.error("Error cleaning up auth user:", e);
      }
      return res.status(400).json({ error: profileError.message });
    }

    res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};
