import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type UserRole = "cliente" | "agente" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

interface AuthSession {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  signUp: (email: string, password: string, role?: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedSession = localStorage.getItem("auth_session");
        if (savedSession) {
          try {
            const parsedSession: AuthSession = JSON.parse(savedSession);
            if (parsedSession.access_token && parsedSession.refresh_token) {
              await supabase.auth
                .setSession({
                  access_token: parsedSession.access_token,
                  refresh_token: parsedSession.refresh_token,
                })
                .catch(() => {});
            }
            setSession(parsedSession);
            await validateSession(parsedSession.access_token);
          } catch (error) {
            console.error("Failed to restore session:", error);
            localStorage.removeItem("auth_session");
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const validateSession = async (accessToken: string) => {
    try {
      const response = await fetch("/api/auth/session", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        const data = await response.json();
        setUser(data.user);
        return;
      }
    } catch {
      // Backend no disponible (hosting estático)
    }

    try {
      const {
        data: { user: supaUser },
        error,
      } = await supabase.auth.getUser(accessToken);

      if (error || !supaUser) throw error || new Error("Sesión inválida");

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", supaUser.id)
        .single();

      setUser({
        id: supaUser.id,
        email: supaUser.email || "",
        role: (profile?.role as UserRole) || "cliente",
      });
    } catch (error) {
      console.error("Session validation error:", error);
      setUser(null);
      setSession(null);
      localStorage.removeItem("auth_session");
    }
  };

  const signUp = async () => {
    throw new Error("El registro público está deshabilitado.");
  };

  const signIn = async (email: string, password: string) => {
    // 1. Intento por backend local cuando Express está activo
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        if (response.ok) {
          const data = await response.json();
          if (data.user?.role !== "admin" && data.user?.role !== "agente") {
            await supabase.auth.signOut().catch(() => {});
            throw new Error("Acceso restringido únicamente a personal autorizado.");
          }
          if (data.session?.access_token && data.session?.refresh_token) {
            await supabase.auth
              .setSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
              })
              .catch(() => {});
          }
          setUser(data.user);
          setSession(data.session);
          localStorage.setItem("auth_session", JSON.stringify(data.session));
          return;
        } else {
          const errData = await response.json();
          throw new Error(errData.error || "Credenciales incorrectas");
        }
      }
    } catch (error: any) {
      if (
        error?.message &&
        !error.message.includes("is not valid JSON") &&
        !error.message.includes("Unexpected token") &&
        !error.message.includes("Failed to fetch")
      ) {
        throw error;
      }
    }

    // 2. Autenticación directa con Supabase (hosting estático)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || "Credenciales incorrectas");
    }

    if (!data.user || !data.session) {
      throw new Error("No se pudo iniciar sesión");
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const role = (profile?.role as UserRole) || "cliente";
    if (role !== "admin" && role !== "agente") {
      await supabase.auth.signOut().catch(() => {});
      throw new Error("Acceso restringido únicamente a personal autorizado.");
    }

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || email,
      role,
    };

    const authSession: AuthSession = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    };

    setUser(authUser);
    setSession(authSession);
    localStorage.setItem("auth_session", JSON.stringify(authSession));
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut().catch(() => {});
      setUser(null);
      setSession(null);
      localStorage.removeItem("auth_session");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user && !!session,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
