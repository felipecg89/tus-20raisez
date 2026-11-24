import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, MessageSquare, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { PRIVATE_ROUTES } from "@/lib/routes";
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

        {/* Zona 2 (Centro): Módulos principales de la plataforma en escritorio */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            to="/casas"
            className="text-sm font-semibold text-[#101B24] hover:text-[#1B4965] transition-colors flex items-center gap-1.5"
          >
            <span>🏡</span>
            <span>{t.header.casas || "Casas y Terrenos"}</span>
          </Link>
          <Link
            to="/rentals"
            className="text-sm font-semibold text-[#101B24] hover:text-[#1B4965] transition-colors flex items-center gap-1.5"
          >
            <span>🏢</span>
            <span>{language === "es" ? "Alquilar" : "Rentals"}</span>
          </Link>
          <Link
            to="/imss"
            className="text-sm font-semibold text-[#101B24] hover:text-[#1B4965] transition-colors flex items-center gap-1.5"
          >
            <span>💼</span>
            <span>{t.header.imssInfonavit || "IMSS e Infonavit"}</span>
          </Link>
          <Link
            to="/legal"
            className="text-sm font-semibold text-[#101B24] hover:text-[#1B4965] transition-colors flex items-center gap-1.5"
          >
            <span>⚖️</span>
            <span>{t.header.asesoriaLegal || "Asesoría Legal"}</span>
          </Link>
        </div>

        {/* Zona 3 (Derecha): Selector de idioma + Botón CTA principal */}
        <div className="flex items-center gap-2 md:gap-3">
          {user && (user.role === "admin" || user.role === "agente") && (
            <Link
              to={PRIVATE_ROUTES.admin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm min-h-[38px]"
              title="Panel Administrativo"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Panel</span>
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
        <div className="lg:hidden border-t border-[#DFE5EA] bg-white px-4 py-4 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2">
          {/* Módulos Principales */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#DFE5EA]">
            <Link
              to="/casas"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl text-sm font-bold text-[#101B24] bg-[#F7F8FA] hover:bg-[#1B4965]/10 hover:text-[#1B4965] flex items-center gap-2 transition-colors border border-[#DFE5EA]"
            >
              <span className="text-lg">🏡</span>
              <span>{t.header.casas || "Casas"}</span>
            </Link>
            <Link
              to="/rentals"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl text-sm font-bold text-[#101B24] bg-[#F7F8FA] hover:bg-[#1B4965]/10 hover:text-[#1B4965] flex items-center gap-2 transition-colors border border-[#DFE5EA]"
            >
              <span className="text-lg">🏢</span>
              <span>{language === "es" ? "Alquilar" : "Rentals"}</span>
            </Link>
            <Link
              to="/imss"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl text-sm font-bold text-[#101B24] bg-[#F7F8FA] hover:bg-[#1B4965]/10 hover:text-[#1B4965] flex items-center gap-2 transition-colors border border-[#DFE5EA]"
            >
              <span className="text-lg">💼</span>
              <span>IMSS / Infonavit</span>
            </Link>
            <Link
              to="/legal"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl text-sm font-bold text-[#101B24] bg-[#F7F8FA] hover:bg-[#1B4965]/10 hover:text-[#1B4965] flex items-center gap-2 transition-colors border border-[#DFE5EA]"
            >
              <span className="text-lg">⚖️</span>
              <span>Asesoría Legal</span>
            </Link>
          </div>

          {user && (user.role === "admin" || user.role === "agente") && (
            <div className="pt-1 border-t border-[#DFE5EA] flex justify-between items-center text-xs">
              <Link
                to={PRIVATE_ROUTES.admin}
                onClick={() => setIsOpen(false)}
                className="text-[#1B4965] font-semibold hover:underline flex items-center gap-1.5 py-1.5"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                Ir al Panel Administrativo
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
