import { RequestHandler } from "express";
import { supabaseAdmin } from "../lib/supabase";

const DEMO_USERS = [
  {
    email: "admin@test.com",
    password: "Admin123456",
    role: "admin" as const,
    description: "Usuario administrador de prueba",
  },
  {
    email: "agent@test.com",
    password: "Agent123456",
    role: "agente" as const,
    description: "Usuario agente de prueba",
  },
  {
    email: "client@test.com",
    password: "Client123456",
    role: "cliente" as const,
    description: "Usuario cliente de prueba",
  },
];

/**
 * POST /api/admin/create-demo-users
 * Crea usuarios de demostración para pruebas
 * SOLO PARA DESARROLLO
 */
export const createDemoUsers: RequestHandler = async (req, res) => {
  try {
    // En producción, esto debería estar protegido
    // Por ahora solo funciona en desarrollo
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        error: "Esta función solo está disponible en desarrollo",
      });
    }

    const results = [];

    for (const user of DEMO_USERS) {
      try {
        // Verificar si el usuario ya existe
        const { data: existingUser } = await supabaseAdmin
          .from("user_profiles")
          .select("id")
          .eq("email", user.email)
          .single();

        if (existingUser) {
          results.push({
            email: user.email,
            status: "already_exists",
            description: user.description,
          });
          continue;
        }

        // Crear usuario en auth
        const { data: authData, error: authError } = 
          await supabaseAdmin.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
          });

        if (authError) {
          results.push({
            email: user.email,
            status: "error",
            error: authError.message,
          });
          continue;
        }

        if (!authData.user) {
          results.push({
            email: user.email,
            status: "error",
            error: "Failed to create user",
          });
          continue;
        }

        // Crear perfil con el rol
        const { data: profile, error: profileError } = await supabaseAdmin
          .from("user_profiles")
          .insert({
            id: authData.user.id,
            email: user.email,
            role: user.role,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (profileError) {
          // Limpiar usuario de auth
          try {
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          } catch (e) {
            console.error("Error cleaning up user:", e);
          }
          
          results.push({
            email: user.email,
            status: "error",
            error: profileError.message,
          });
          continue;
        }

        results.push({
          email: user.email,
          role: user.role,
          password: user.password,
          status: "created",
          description: user.description,
        });
      } catch (error) {
        results.push({
          email: user.email,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    res.json({
      message: "Demo users creation completed",
      results,
      summary: {
        total: DEMO_USERS.length,
        created: results.filter((r) => r.status === "created").length,
        failed: results.filter((r) => r.status === "error").length,
        already_exists: results.filter((r) => r.status === "already_exists").length,
      },
    });
  } catch (error) {
    console.error("Error creating demo users:", error);
    res.status(500).json({
      error: "Error creating demo users",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
