import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, MessageSquare, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { translations } from "@/translations";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const t = translations[language];

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DFE5EA] shadow-xs">
      <nav className="container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
        {/* Zona 1 (Izquierda): Solo Logotipo oficial en grande */}
        <Link
          to="/"
          className="flex items-center hover:opacity-90 transition-opacity flex-shrink-0 py-1"
        >
          <img
            src="/logo.png"
            alt="Tus Raíces MX - Invierte. Protege. Regresa."
            className="h-14 sm:h-16 md:h-20 w-auto object-contain"
          />
        </Link>

        {/* Zona 2 (Centro): 4 enlaces cortos centrados en escritorio (ocultos en móvil) */}
        <div className="hidden lg:flex items-center gap-7">
          <a
            href="#servicios"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("servicios");
            }}
            className="text-sm font-medium text-[#465664] hover:text-[#1B4965] transition-colors"
          >
            {language === "es" ? "Servicios" : "Services"}
          </a>
          <a
            href="#respaldo"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("respaldo");
            }}
            className="text-sm font-medium text-[#465664] hover:text-[#1B4965] transition-colors"
          >
            {language === "es" ? "Respaldo" : "Trust & Support"}
          </a>
          <a
            href="#como-funciona"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("como-funciona");
            }}
            className="text-sm font-medium text-[#465664] hover:text-[#1B4965] transition-colors"
          >
            {language === "es" ? "Cómo funciona" : "How it works"}
          </a>
          <a
            href="#testimonios"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("testimonios");
            }}
            className="text-sm font-medium text-[#465664] hover:text-[#1B4965] transition-colors"
          >
            {language === "es" ? "Testimonios" : "Testimonials"}
          </a>
        </div>

        {/* Zona 3 (Derecha): Selector de idioma + Botón CTA principal */}
        <div className="flex items-center gap-2 md:gap-3">
          {user && (user.role === "admin" || user.role === "agente") && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm min-h-[38px]"
              title="Panel Administrativo"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">cPanel</span>
            </Link>
          )}

          {/* Selector de idioma sutil */}
          <div className="relative">
            <button
              onClick={() => setLangDropdown(!langDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#465664] hover:text-[#101B24] hover:bg-[#F7F8FA] border border-[#DFE5EA] transition-all min-h-[38px]"
              aria-label="Cambiar idioma"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase">{language}</span>
            </button>
            {langDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-[#DFE5EA] rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                <button
                  onClick={() => {
                    setLanguage("es");
                    setLangDropdown(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2",
                    language === "es"
                      ? "bg-[#1B4965]/10 text-[#1B4965] font-bold"
                      : "text-[#465664] hover:bg-slate-50"
                  )}
                >
                  <span>🇲🇽</span> Español
                </button>
                <button
                  onClick={() => {
                    setLanguage("en");
                    setLangDropdown(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2",
                    language === "en"
                      ? "bg-[#1B4965]/10 text-[#1B4965] font-bold"
                      : "text-[#465664] hover:bg-slate-50"
                  )}
                >
                  <span>🇺🇸</span> English
                </button>
              </div>
            )}
          </div>

          {/* CTA Principal (altura mínima 44px) */}
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contacto");
            }}
            className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#1B4965] hover:bg-[#13374E] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4" />
            {t.header.hablaConAsesor || "Habla con un asesor"}
          </a>

          {/* Botón CTA compacto para móvil */}
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contacto");
            }}
            className="sm:hidden inline-flex items-center justify-center bg-[#1B4965] text-white px-3.5 py-2 rounded-xl font-semibold text-xs min-h-[44px]"
          >
            {language === "es" ? "Asesor" : "Advisor"}
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[#465664] hover:text-[#101B24] hover:bg-[#F7F8FA] rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Abrir menú"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className="lg:hidden border-t border-[#DFE5EA] bg-white px-4 py-4 shadow-lg space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#DFE5EA]">
            <a
              href="#servicios"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("servicios");
              }}
              className="p-2.5 rounded-lg text-sm font-medium text-[#101B24] bg-[#F7F8FA] hover:bg-[#DFE5EA]/40 text-center"
            >
              {language === "es" ? "Servicios" : "Services"}
            </a>
            <a
              href="#respaldo"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("respaldo");
              }}
              className="p-2.5 rounded-lg text-sm font-medium text-[#101B24] bg-[#F7F8FA] hover:bg-[#DFE5EA]/40 text-center"
            >
              {language === "es" ? "Respaldo" : "Trust & Support"}
            </a>
            <a
              href="#como-funciona"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("como-funciona");
              }}
              className="p-2.5 rounded-lg text-sm font-medium text-[#101B24] bg-[#F7F8FA] hover:bg-[#DFE5EA]/40 text-center"
            >
              {language === "es" ? "Cómo funciona" : "How it works"}
            </a>
            <a
              href="#testimonios"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("testimonios");
              }}
              className="p-2.5 rounded-lg text-sm font-medium text-[#101B24] bg-[#F7F8FA] hover:bg-[#DFE5EA]/40 text-center"
            >
              {language === "es" ? "Testimonios" : "Testimonials"}
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-1.5 text-xs text-[#465664]">
            <Link to="/casas" className="py-2 hover:text-[#1B4965] font-medium" onClick={() => setIsOpen(false)}>
              🏡 {t.header.casas}
            </Link>
            <Link to="/imss" className="py-2 hover:text-[#1B4965] font-medium" onClick={() => setIsOpen(false)}>
              💼 {t.header.imssInfonavit}
            </Link>
            <Link to="/legal" className="py-2 hover:text-[#1B4965] font-medium" onClick={() => setIsOpen(false)}>
              ⚖️ {t.header.asesoriaLegal}
            </Link>
            <Link to="/rentals" className="py-2 hover:text-[#1B4965] font-medium" onClick={() => setIsOpen(false)}>
              🏢 {language === "es" ? "Alquilar" : "Rentals"}
            </Link>
          </div>
          <div className="pt-2 border-t border-[#DFE5EA] flex justify-between items-center text-xs">
            <Link
              to={user ? "/admin" : "/login"}
              onClick={() => setIsOpen(false)}
              className="text-[#1B4965] font-semibold hover:underline flex items-center gap-1.5 py-1"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              {user ? "Ir a cPanel Administrativo" : "Acceso Administrativo / cPanel"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
