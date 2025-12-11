import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl text-primary hover:opacity-80 transition-opacity"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fc4331b9719fe4840b03d2b99c1afbc5e%2F04bfe224a10d4c11bf6172ee1e881e7a?format=webp&width=800"
              alt="Tus Raíces MX Logo"
              className="h-24 w-auto"
            />
            <span className="hidden sm:inline text-foreground">Tus Raíces MX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t.header.inicio}
            </Link>
            <Link
              to="/casas"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t.header.casas}
            </Link>
            <Link
              to="/rentals"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {language === "es" ? "Alquilar" : "Rentals"}
            </Link>
            <Link
              to="/imss"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t.header.imssInfonavit}
            </Link>
            <Link
              to="/legal"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t.header.asesoriaLegal}
            </Link>
            <a
              href="#contacto"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t.header.contacto}
            </a>

            <Link
              to="/admin"
              className="text-foreground/60 hover:text-primary transition-colors"
              title="Panel Administrativo"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors border border-border"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">{language}</span>
              </button>
              {langDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-border rounded-lg shadow-lg">
                  <button
                    onClick={() => {
                      setLanguage("es");
                      setLangDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-muted transition-colors",
                      language === "es" && "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setLangDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-muted transition-colors",
                      language === "en" && "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    🇬🇧 English
                  </button>
                </div>
              )}
            </div>

            <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              {t.header.hablaConAsesor}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5 text-foreground" />
              </button>
              {langDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-border rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      setLanguage("es");
                      setLangDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm",
                      language === "es" && "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setLangDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm",
                      language === "en" && "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    🇬🇧 English
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg mt-0">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {t.header.inicio}
              </Link>
              <Link
                to="/casas"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {t.header.casas}
              </Link>
              <Link
                to="/rentals"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {language === "es" ? "Alquilar" : "Rentals"}
              </Link>
              <Link
                to="/imss"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {t.header.imssInfonavit}
              </Link>
              <Link
                to="/legal"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {t.header.asesoriaLegal}
              </Link>
              <a
                href="#contacto"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {t.header.contacto}
              </a>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors w-full">
                {t.header.hablaConAsesor}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
