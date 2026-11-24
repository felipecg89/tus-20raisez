import "./global.css";
import React, { useEffect } from "react";
import { createRoot, Root } from "react-dom/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { initializeHubSpot } from "@/lib/hubspotService";
import { PRIVATE_ROUTES } from "@/lib/routes";
import { handleStaticSupabaseApi } from "@/lib/staticApiFallback";
import Index from "./pages/Index";
import Casas from "./pages/Casas";
import PropertyDetail from "./pages/PropertyDetail";
import Rentals from "./pages/Rentals";
import Imss from "./pages/Imss";
import Legal from "./pages/Legal";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import AdminProductDetail from "./pages/AdminProductDetail";
import Login from "./pages/Login";
import Agentes from "./pages/Agentes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Interceptor global para adjuntar el token de sesión a /api/ y resolver directo en Supabase en hosting estático
if (typeof window !== "undefined") {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    let url = "";
    if (typeof input === "string") url = input;
    else if (input instanceof URL) url = input.toString();
    else if (input && typeof input === "object" && "url" in input) url = (input as Request).url;

    const isApiRequest = url.startsWith("/api/") || url.includes("/api/");
    const isAuthRoute = url.includes("/api/auth/");

    if (isApiRequest && !isAuthRoute) {
      try {
        const sessionStr = localStorage.getItem("auth_session");
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session?.access_token) {
            const headers = new Headers(init.headers || {});
            if (!headers.has("Authorization")) {
              headers.set("Authorization", `Bearer ${session.access_token}`);
            }
            init = { ...init, headers };
          }
        }
      } catch {
        // Ignorar error al leer sesión
      }
    }

    if (isApiRequest && !isAuthRoute) {
      try {
        const response = await originalFetch(input, init);
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          return response;
        }
        // En hosting estático (Hostinger/Apache), /api/* devuelve index.html (text/html) o 404
        const fallback = await handleStaticSupabaseApi(url, init);
        if (fallback) return fallback;
        return response;
      } catch (err) {
        const fallback = await handleStaticSupabaseApi(url, init);
        if (fallback) return fallback;
        throw err;
      }
    }

    return originalFetch(input, init);
  };
}

const AppContent = () => {
  useEffect(() => {
    initializeHubSpot();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/casas" element={<Casas />} />
        <Route path="/casas/:id" element={<PropertyDetail />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/imss" element={<Imss />} />
        <Route path="/legal" element={<Legal />} />

        {/* Rutas internas privadas no expuestas públicamente */}
        <Route path={PRIVATE_ROUTES.login} element={<Login />} />
        <Route
          path={PRIVATE_ROUTES.admin}
          element={
            <ProtectedRoute requiredRoles={["admin", "agente"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path={PRIVATE_ROUTES.adminProductDetailPattern}
          element={
            <ProtectedRoute requiredRoles={["admin", "agente"]}>
              <AdminProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path={PRIVATE_ROUTES.agentes}
          element={
            <ProtectedRoute requiredRoles={["agente", "admin"]}>
              <Agentes />
            </ProtectedRoute>
          }
        />

        {/* Cualquier intento a /login, /admin o /agentes cae en 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const AppRoutes = () => (
  <AuthProvider>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
          <WhatsAppWidget />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </AuthProvider>
);

declare global {
  interface Window {
    __REACT_ROOT__?: Root;
    __APP_INITIALIZED__?: boolean;
  }
}

function renderApp() {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element not found");
  }

  if (!window.__REACT_ROOT__) {
    window.__REACT_ROOT__ = createRoot(rootElement);
  }

  window.__REACT_ROOT__.render(<AppRoutes />);
}

if (!window.__APP_INITIALIZED__) {
  window.__APP_INITIALIZED__ = true;
  renderApp();
}

if (import.meta.hot) {
  import.meta.hot.accept(
    [
      "./pages/Index",
      "./pages/Casas",
      "./pages/PropertyDetail",
      "./pages/Rentals",
      "./pages/Imss",
      "./pages/Legal",
      "./pages/Landing",
      "./pages/Admin",
      "./pages/AdminProductDetail",
      "./pages/Login",
      "./pages/Agentes",
    ],
    () => {
      renderApp();
    },
  );
}
