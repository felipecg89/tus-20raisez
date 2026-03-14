import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "cliente" | "agente" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
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
        // Restore session from localStorage
        const savedSession = localStorage.getItem("auth_session");
        if (savedSession) {
          try {
            const parsedSession = JSON.parse(savedSession);
            setSession(parsedSession);
            // Validate session with backend
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

      if (!response.ok) {
        throw new Error("Invalid session");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Session validation error:", error);
      setUser(null);
      setSession(null);
      localStorage.removeItem("auth_session");
    }
  };

  const signUp = async (email: string, password: string, role: UserRole = "cliente") => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create account");
      }

      const data = await response.json();
      setUser(data.user);
      setSession(data.session);
      localStorage.setItem("auth_session", JSON.stringify(data.session));
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Invalid credentials");
      }

      const data = await response.json();
      setUser(data.user);
      setSession(data.session);
      localStorage.setItem("auth_session", JSON.stringify(data.session));
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
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
