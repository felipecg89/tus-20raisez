import { Link } from "react-router-dom";
import {
  Facebook,
  MessageCircle,
  Music,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 pb-8 border-b border-white/20">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fc4331b9719fe4840b03d2b99c1afbc5e%2F04bfe224a10d4c11bf6172ee1e881e7a?format=webp&width=800"
            alt="Tus Raíces MX Logo"
            className="h-20 w-auto"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Información */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.informacion}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  {t.header.inicio}
                </Link>
              </li>
              <li>
                <Link to="/casas" className="hover:text-primary transition-colors">
                  {t.header.casas}
                </Link>
              </li>
              <li>
                <Link to="/imss" className="hover:text-primary transition-colors">
                  {t.header.imssInfonavit}
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-primary transition-colors">
                  {t.header.asesoriaLegal}
                </Link>
              </li>
              <li>
                <a href="#contacto" className="hover:text-primary transition-colors">
                  {t.header.contacto}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Soporte */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.soporte}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-secondary" />
                <span className="text-sm">WhatsApp</span>
              </li>
              <li className="flex items-center gap-2 ml-6">
                <span className="text-xs">🇺🇸</span>
                <a
                  href="https://wa.me/18887209656"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-primary transition-colors"
                >
                  +1 (888) 720-9656
                </a>
              </li>
              <li className="flex items-start gap-2 ml-6">
                <span className="text-xs">🇲🇽</span>
                <div className="space-y-1">
                  <a
                    href="https://wa.me/18003511039"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary transition-colors block"
                  >
                    +1 (800) 351-1039
                  </a>
                  <a
                    href="https://wa.me/524923860125"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary transition-colors block"
                  >
                    +52 (492) 386-0125
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" />
                <a
                  href="mailto:info@tusraicesmx.com"
                  className="hover:text-primary transition-colors"
                >
                  Email
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span>{t.contactForm.hours}</span>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t.footer.preguntas}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Empresa */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.empresa}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t.footer.privacidad}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t.footer.terminos}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t.footer.politicaDatos}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors"
              >
                <Music className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-white/70">{t.footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
