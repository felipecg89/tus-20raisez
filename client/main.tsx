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
import Imss from "./pages/Imss";
import Legal from "./pages/Legal";
import Landing from "./pages/Landing";
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
            <Route path="/imss" element={<Imss />} />
            <Route path="/legal" element={<Legal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

let root: Root | null = null;

function renderApp() {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element not found");
  }

  // Unmount existing root before creating a new one during HMR
  if (root) {
    root.unmount();
    root = null;
  }

  root = createRoot(rootElement);
  root.render(<AppRoutes />);
}

// Initial render
renderApp();

// Handle HMR
if (import.meta.hot) {
  import.meta.hot.accept(["./pages/Index", "./pages/Casas", "./pages/Imss", "./pages/Legal", "./pages/Landing"], () => {
    renderApp();
  });
}
