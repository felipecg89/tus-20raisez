import "./global.css";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Casas from "./pages/Casas";
import PropertyDetail from "./pages/PropertyDetail";
import Rentals from "./pages/Rentals";
import Imss from "./pages/Imss";
import Legal from "./pages/Legal";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/casas" element={<Casas />} />
            <Route path="/casas/:id" element={<PropertyDetail />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/imss" element={<Imss />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
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

  // Create root only once, store in window to survive HMR
  if (!window.__REACT_ROOT__) {
    window.__REACT_ROOT__ = createRoot(rootElement);
  }

  window.__REACT_ROOT__.render(<AppRoutes />);
}

// Initial render (only on first load, not on HMR)
if (!window.__APP_INITIALIZED__) {
  window.__APP_INITIALIZED__ = true;
  renderApp();
}

// Handle HMR
if (import.meta.hot) {
  import.meta.hot.accept(
    [
      "./pages/Index",
      "./pages/Casas",
      "./pages/PropertyDetail",
      "./pages/Imss",
      "./pages/Legal",
      "./pages/Landing",
      "./pages/Admin",
    ],
    () => {
      renderApp();
    },
  );
}
