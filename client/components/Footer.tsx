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
import { getWhatsAppUrl } from "@/lib/contact";

export const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-[#101B24] text-white border-t border-[#DFE5EA]/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 0: Brand & Logo */}
          <div className="space-y-4">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <img
                src="/logo.png"
                alt="Tus Raíces MX"
                className="h-14 sm:h-16 w-auto object-contain bg-white rounded-2xl p-2 shadow-md"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {language === "es"
                ? "Conectamos los sueños de la comunidad hispana en EE. UU. con su patrimonio en México con certeza jurídica y fe notarial."
                : "Connecting US Latino dreams with their heritage in Mexico with absolute legal certainty and notary backup."}
            </p>
          </div>

          {/* Column 1: Información */}
          <div>
            <h3 className="font-heading font-bold text-base mb-4 text-white">{t.footer.informacion}</h3>
            <ul className="space-y-2 text-xs md:text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {t.header.inicio}
                </Link>
              </li>
              <li>
                <Link to="/casas" className="hover:text-white transition-colors">
                  {t.header.casas}
                </Link>
              </li>
              <li>
                <Link to="/imss" className="hover:text-white transition-colors">
                  {t.header.imssInfonavit}
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">
                  {t.header.asesoriaLegal}
                </Link>
              </li>
              <li>
                <Link to="/rentals" className="hover:text-white transition-colors">
                  {language === "es" ? "Alquileres" : "Rentals"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Soporte */}
          <div>
            <h3 className="font-heading font-bold text-base mb-4 text-white">{t.footer.soporte}</h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-sm">🇺🇸</span>
                <a
                  href="tel:+18884312431"
                  className="hover:text-white transition-colors font-medium"
                >
                  +1 (888) 431-2431 <span className="text-[11px] text-slate-400">(Toll-Free USA)</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm">🇲🇽</span>
                <a
                  href="tel:+528004610316"
                  className="hover:text-white transition-colors font-medium"
                >
                  +52 (800) 461-0316 <span className="text-[11px] text-slate-400">(Gratis México)</span>
                </a>
              </li>
              <li className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href="mailto:asesores@tusraices.com.mx"
                  className="hover:text-white transition-colors"
                >
                  asesores@tusraices.com.mx
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{t.contactForm.hours}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Empresa y Legal */}
          <div>
            <h3 className="font-heading font-bold text-base mb-4 text-white">{t.footer.empresa}</h3>
            <ul className="space-y-2 text-xs md:text-sm text-slate-300">
              <li>
                <a href="#respaldo" className="hover:text-white transition-colors">
                  {language === "es" ? "Respaldo Notarial" : "Notary Assurance"}
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-white transition-colors">
                  {t.header.contacto}
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors text-slate-400">
                  {language === "es" ? "Acceso Asesores" : "Agent Portal"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 rounded-xl hover:bg-[#1B4965] hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 rounded-xl hover:bg-[#25D366] hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 rounded-xl hover:bg-[#1B4965] hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <Music className="w-4 h-4" />
            </a>
          </div>
          <p>© {new Date().getFullYear()} Tus Raíces MX. {language === "es" ? "Todos los derechos reservados. Invierte · Protege · Regresa." : "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
};
