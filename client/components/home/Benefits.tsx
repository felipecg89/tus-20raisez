import { ShieldCheck, Star, Award, HeartHandshake, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Benefits = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const reasons = [
    {
      title: language === "es" ? "Certeza jurídica y fe notarial" : "Legal certainty and notary backup",
      desc:
        language === "es"
          ? "Cada propiedad y poder se formaliza ante notario público certificado para blindar tu patrimonio en ambos lados de la frontera."
          : "Every deed and power of attorney is verified by certified Mexican notaries to secure your assets cross-border.",
    },
    {
      title: language === "es" ? "Acompañamiento integral sin intermediarios" : "End-to-end guidance with zero hassle",
      desc:
        language === "es"
          ? "Te asignamos un asesor especializado en EE. UU. que coordina todo el proceso en México de principio a fin."
          : "A dedicated US-based advisor manages every step on the ground in Mexico until completion.",
    },
    {
      title: language === "es" ? "Alianza Infonavit Sin Fronteras" : "Infonavit Sin Fronteras authorized partner",
      desc:
        language === "es"
          ? "Aprovecha tus aportaciones o saldo de vivienda para adquirir tu patrimonio sin viajar y sin comisiones sorpresa."
          : "Unlock your housing savings to purchase property in Mexico without traveling or hidden fees.",
    },
    {
      title: language === "es" ? "Reactivación de semanas y Modalidad 40" : "IMSS pension week recovery & Mod 40",
      desc:
        language === "es"
          ? "Especialistas en seguridad social para que obtengas la mejor pensión posible aunque lleves años viviendo en EE. UU."
          : "Social security specialists ensuring your maximum pension payout even after decades living in the US.",
    },
  ];

  const testimonials = [
    {
      service: language === "es" ? "🏡 Compra de Casa" : "🏡 Home Purchase",
      text: t.testimonials.testimonial1.text,
      name: t.testimonials.testimonial1.name,
      location: t.testimonials.testimonial1.location,
      rating: 5,
    },
    {
      service: language === "es" ? "⚖️ Poder Notarial y Escritura" : "⚖️ Notary Deed & Power",
      text: t.testimonials.testimonial2.text,
      name: t.testimonials.testimonial2.name,
      location: t.testimonials.testimonial2.location,
      rating: 5,
    },
    {
      service: language === "es" ? "💼 Pensión IMSS Modalidad 40" : "💼 IMSS Mod 40 Pension",
      text: t.testimonials.testimonial3.text,
      name: t.testimonials.testimonial3.name,
      location: t.testimonials.testimonial3.location,
      rating: 5,
    },
  ];

  return (
    <section id="respaldo" className="py-16 md:py-24 bg-white border-b border-[#DFE5EA]">
      <div className="container mx-auto px-4">
        {/* Encabezado general */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16 space-y-2">
          <p className="text-xs md:text-sm font-bold text-[#1B4965] uppercase tracking-wider">
            {language === "es" ? "Respaldo y Confianza Binacional" : "Cross-Border Trust & Track Record"}
          </p>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[#101B24] tracking-tight">
            {language === "es" ? "¿Por qué los paisanos eligen Tus Raíces?" : "Why US Latinos choose Tus Raíces"}
          </h2>
          <p className="text-sm md:text-base text-[#465664]">
            {language === "es"
              ? "Más de una década conectando familias hispanas en EE. UU. con su tierra natal con total certeza legal."
              : "Over a decade helping US Hispanic families secure their heritage in Mexico with absolute legal certainty."}
          </p>
        </div>

        {/* Retícula de 2 columnas: Columna Izquierda (Razones divide-y) + Columna Derecha (3 Testimonios) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Columna Izquierda: Razones limpias con divide-y */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-[#DFE5EA]">
              <div className="w-9 h-9 rounded-xl bg-[#1B4965]/10 flex items-center justify-center text-[#1B4965]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl md:text-2xl text-[#101B24]">
                {language === "es" ? "Garantía y tranquilidad para tu familia" : "Peace of mind for your family"}
              </h3>
            </div>

            <div className="divide-y divide-[#DFE5EA]">
              {reasons.map((r, idx) => (
                <div key={idx} className="py-5 first:pt-2 last:pb-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-heading font-bold text-base md:text-lg text-[#101B24] mb-1">
                        {r.title}
                      </h4>
                      <p className="text-xs md:text-sm text-[#465664] leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sello de confianza */}
            <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#DFE5EA] flex items-center gap-3">
              <Award className="w-8 h-8 text-[#1B4965] flex-shrink-0" />
              <p className="text-xs text-[#465664] leading-tight">
                <span className="font-bold text-[#101B24]">
                  {language === "es" ? "Red de Notarías Asociadas: " : "Certified Notary Network: "}
                </span>
                {language === "es"
                  ? "Atención en los 32 estados de la República Mexicana y consulados en EE. UU."
                  : "Serving all 32 Mexican states and consulates across the United States."}
              </p>
            </div>
          </div>

          {/* Columna Derecha: 3 Testimonios reales (id="testimonios") */}
          <div id="testimonios" className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#DFE5EA]">
              <div className="w-9 h-9 rounded-xl bg-[#C8102E]/10 flex items-center justify-center text-[#C8102E]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl md:text-2xl text-[#101B24]">
                  {language === "es" ? "Historias reales de éxito" : "Real Success Stories"}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#F7F8FA] hover:bg-white rounded-2xl p-5 border border-[#DFE5EA] shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  {/* Arriba: Servicio / resultado y estrellas */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block text-xs font-bold text-[#1B4965] bg-white px-2.5 py-1 rounded-lg border border-[#DFE5EA] shadow-2xs">
                      {item.service}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Centro: La cita */}
                  <p className="text-xs md:text-sm text-[#101B24] italic leading-relaxed">
                    "{item.text}"
                  </p>

                  {/* Pie: Nombre y ubicación */}
                  <div className="pt-2 border-t border-[#DFE5EA]/80 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#101B24]">{item.name}</span>
                    <span className="text-[#465664] font-medium">{item.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
