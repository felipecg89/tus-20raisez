import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone, ShieldCheck, Clock, CheckCircle2, Globe2, Layers } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { CONTACT_CONFIG } from "@/lib/contact";

export const Hero = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const scrollToServices = () => {
    const el = document.getElementById("servicios");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-[#F7F8FA] overflow-hidden pt-8 pb-12 md:pt-14 md:pb-16 border-b border-[#DFE5EA]">
      <div className="container mx-auto px-4">
        {/* 12 columnas equilibradas en escritorio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Columna Izquierda (7 cols en escritorio) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Texto corto superior sin cápsula */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-[#1B4965] tracking-wide uppercase">
              <span className="inline-block w-2 h-2 rounded-full bg-[#C8102E]"></span>
              {language === "es"
                ? "Atención binacional · EE. UU. y México"
                : "Bi-national Service · US and Mexico"}
            </div>

            {/* Titular completo con text-balance asegurando que México nunca se corte */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#101B24] leading-[1.12] tracking-tight [text-wrap:balance]">
              {language === "es" ? (
                <>
                  Conecta tus sueños de Estados Unidos con tu hogar en{" "}
                  <span className="text-[#1B4965] underline decoration-[#C8102E] decoration-4 underline-offset-4">
                    México
                  </span>
                </>
              ) : (
                <>
                  Connect your American dreams with your home in{" "}
                  <span className="text-[#1B4965] underline decoration-[#C8102E] decoration-4 underline-offset-4">
                    Mexico
                  </span>
                </>
              )}
            </h1>

            {/* Subtítulo claro */}
            <p className="text-base sm:text-lg text-[#465664] max-w-xl leading-relaxed">
              {language === "es"
                ? "Comprar casa, recuperar tus semanas del IMSS, gestionar escrituras o rentar en México sin salir de Estados Unidos. Certeza legal, créditos Infonavit y atención en tu idioma."
                : "Buy a home, recover your IMSS pension weeks, manage property deeds or rent in Mexico from the US. Legal certainty, Infonavit loans, and expert care in your language."}
            </p>

            {/* Botones amplios (mínimo 48px de alto en móvil) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate("/landing")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#1B4965] hover:bg-[#13374E] text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-md min-h-[48px] active:scale-[0.99]"
              >
                <span>{language === "es" ? "Quiero empezar" : "Get Started"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToServices}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-[#F7F8FA] text-[#1B4965] border border-[#DFE5EA] px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 min-h-[48px] active:scale-[0.99]"
              >
                {language === "es" ? "Conocer más" : "Learn More"}
              </button>
            </div>

            {/* Enlaces clicables directos a teléfonos EE.UU. / MX discretamente debajo */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#465664]">
              <span className="font-semibold text-[#101B24]">
                {language === "es" ? "Llámanos gratis:" : "Toll-Free:"}
              </span>
              <a
                href={`tel:${CONTACT_CONFIG.phoneUSARaw}`}
                className="inline-flex items-center gap-1.5 font-medium text-[#1B4965] hover:underline"
              >
                <span>🇺🇸 USA:</span> {CONTACT_CONFIG.phoneUSA}
              </a>
              <span className="text-slate-300">•</span>
              <a
                href={`tel:${CONTACT_CONFIG.phoneMXRaw}`}
                className="inline-flex items-center gap-1.5 font-medium text-[#1B4965] hover:underline"
              >
                <span>🇲🇽 MX:</span> {CONTACT_CONFIG.phoneMX}
              </a>
            </div>
          </div>

          {/* Columna Derecha (5 cols en escritorio) con fotografía arquitectónica cálida y tarjeta integrada */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[340px] lg:min-h-[460px] rounded-3xl overflow-hidden shadow-xl border border-[#DFE5EA] bg-slate-900 group">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
              alt="Casa moderna en México - Tus Raíces"
              className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            />
            {/* Degradado oscuro inferior suave */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent"></div>

            {/* Tarjeta blanca compacta con el logotipo nuevo y respaldo notarial */}
            <div className="relative z-10 m-4 sm:m-6 mt-auto bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/50 shadow-2xl max-w-sm w-full">
              <div className="flex items-center gap-3 mb-2.5 pb-2.5 border-b border-[#DFE5EA]">
                <img
                  src="/logo.png"
                  alt="Tus Raíces MX"
                  className="h-10 w-auto object-contain flex-shrink-0"
                />
                <div className="text-left">
                  <p className="font-heading font-bold text-sm text-[#101B24] leading-tight">
                    Tus Raíces MX
                  </p>
                  <p className="text-[11px] text-[#465664]">
                    {language === "es" ? "Asesoría Inmobiliaria y Legal" : "Real Estate & Legal Advisory"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-[#101B24] font-medium leading-snug">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  {language === "es"
                    ? "Operaciones con fe notarial y certeza jurídica garantizada"
                    : "Notary-backed transactions with full cross-border legal certainty"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Debajo del Hero: Franja de 4 métricas clave (grid-cols-2 en móvil, grid-cols-4 en PC) */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-[#DFE5EA]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 rounded-2xl border border-[#DFE5EA] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B4965]/10 flex items-center justify-center flex-shrink-0 text-[#1B4965]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg sm:text-xl text-[#101B24] leading-tight">
                  &lt; 1 hora
                </p>
                <p className="text-xs text-[#465664]">
                  {language === "es" ? "Respuesta inicial" : "First response"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DFE5EA] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg sm:text-xl text-[#101B24] leading-tight">
                  100%
                </p>
                <p className="text-xs text-[#465664]">
                  {language === "es" ? "Digital y presencial" : "Digital & in-person"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DFE5EA] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C8102E]/10 flex items-center justify-center flex-shrink-0 text-[#C8102E]">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg sm:text-xl text-[#101B24] leading-tight">
                  EE. UU. / MX
                </p>
                <p className="text-xs text-[#465664]">
                  {language === "es" ? "Español e inglés" : "Spanish & English"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DFE5EA] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B4965]/10 flex items-center justify-center flex-shrink-0 text-[#1B4965]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg sm:text-xl text-[#101B24] leading-tight">
                  4 áreas
                </p>
                <p className="text-xs text-[#465664]">
                  {language === "es" ? "Soluciones integrales" : "Complete solutions"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
