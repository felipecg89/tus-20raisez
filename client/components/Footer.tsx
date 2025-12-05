import { Link } from "react-router-dom";
import {
  Facebook,
  MessageCircle,
  Music,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Información */}
          <div>
            <h3 className="font-bold text-lg mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/casas"
                  className="hover:text-primary transition-colors"
                >
                  Casas
                </Link>
              </li>
              <li>
                <Link
                  to="/imss"
                  className="hover:text-primary transition-colors"
                >
                  IMSS/Infonavit
                </Link>
              </li>
              <li>
                <Link
                  to="/legal"
                  className="hover:text-primary transition-colors"
                >
                  Asesoría Legal
                </Link>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="hover:text-primary transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Soporte */}
          <div>
            <h3 className="font-bold text-lg mb-4">Soporte</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-secondary" />
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp
                </a>
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
                <span>Lunes - Viernes: 9am - 6pm CST</span>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Empresa */}
          <div>
            <h3 className="font-bold text-lg mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  Aviso de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  Política de Datos
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
            <p className="text-sm text-white/70">
              © 2024 Tus Raíces MX. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
