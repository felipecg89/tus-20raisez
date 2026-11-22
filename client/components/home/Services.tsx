import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Scale, FileText, Building2, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Services = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeMobileTab, setActiveMobileTab] = useState(0);

  const servicesData = [
    {
      id: "casas",
      title: language === "es" ? "Venta de Casas y Terrenos" : "Homes & Land for Sale",
      tabLabel: language === "es" ? "Casas" : "Homes",
      icon: Home,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
      description:
        language === "es"
          ? "Propiedades verificadas en México con opciones de compra al contado o financiamiento para paisanos en EE. UU."
          : "Verified properties across Mexico with cash purchase and financing options for US buyers.",
      features: [
        language === "es" ? "Revisión técnica y jurídica del inmueble" : "Full legal and structural property audit",
        language === "es" ? "Opciones de crédito Infonavit Sin Fronteras" : "Infonavit Sin Fronteras credit options",
        language === "es" ? "Acompañamiento hasta la entrega de llaves" : "End-to-end guidance to key handover",
      ],
      link: "/casas",
      cta: language === "es" ? "Explorar Propiedades" : "Explore Properties",
    },
    {
      id: "legal",
      title: language === "es" ? "Asesoría Legal Completa" : "Full Legal Advisory",
      tabLabel: language === "es" ? "Legal" : "Legal",
      icon: Scale,
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
      description:
        language === "es"
          ? "Abogados certificados para poderes notariales, regularización de escrituras y herencias sin que viajes a México."
          : "Certified attorneys handling notary powers, property deeds and inheritances without traveling to Mexico.",
      features: [
        language === "es" ? "Poderes notariales consulares en EE. UU." : "Consular notary powers drafted in the US",
        language === "es" ? "Juicios sucesorios y testamentos binacionales" : "Probate proceedings & cross-border wills",
        language === "es" ? "Firma remota con certeza jurídica" : "Remote closing with guaranteed certainty",
      ],
      link: "/legal",
      cta: language === "es" ? "Consultar Abogado" : "Consult Attorney",
    },
    {
      id: "imss",
      title: language === "es" ? "IMSS e Infonavit Sin Fronteras" : "IMSS & Infonavit Cross-Border",
      tabLabel: language === "es" ? "IMSS" : "IMSS",
      icon: FileText,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      description:
        language === "es"
          ? "Recupera tus semanas cotizadas en México con Modalidad 40 y gestiona tu crédito de vivienda desde el extranjero."
          : "Reactivate your Mexican IMSS pension weeks via Modalidad 40 and manage home loans from abroad.",
      features: [
        language === "es" ? "Cálculo y reactivación de Modalidad 40" : "Modalidad 40 pension projection & recovery",
        language === "es" ? "Uso de saldo de la Subcuenta de Vivienda" : "Unlock your housing fund savings",
        language === "es" ? "Trámite 100% digital respaldado por especialistas" : "100% digital process handled by specialists",
      ],
      link: "/imss",
      cta: language === "es" ? "Simular Pensión o Crédito" : "Simulate Pension / Loan",
    },
    {
      id: "alquiler",
      title: language === "es" ? "Alquiler de Casas y Terrenos" : "Home & Land Rentals",
      tabLabel: language === "es" ? "Alquiler" : "Rentals",
      icon: Building2,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      description:
        language === "es"
          ? "Renta tu propiedad en México con administración integral o encuentra alquileres seguros para tu familia."
          : "Rent out your property in Mexico with full management or find secure rentals for your loved ones.",
      features: [
        language === "es" ? "Contratos blindados con póliza jurídica" : "Protected contracts with legal rent warranty",
        language === "es" ? "Cobro y depósito puntual de rentas" : "Prompt automated rent collection & transfer",
        language === "es" ? "Mantenimiento y supervisión presencial" : "Ongoing in-person upkeep and inspection",
      ],
      link: "/rentals",
      cta: language === "es" ? "Ver Alquileres" : "Explore Rentals",
    },
  ];

  return (
    <section id="servicios" className="py-16 md:py-24 bg-[#F7F8FA] border-b border-[#DFE5EA]">
      <div className="container mx-auto px-4">
        {/* Encabezado de sección */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-3">
          <p className="text-xs md:text-sm font-bold text-[#1B4965] uppercase tracking-wider">
            {language === "es" ? "Soluciones Integrales Binacionales" : "Comprehensive Cross-Border Solutions"}
          </p>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[#101B24] tracking-tight">
            {language === "es" ? "Todo lo que necesitas en México, desde EE. UU." : "Everything you need in Mexico, from the US"}
          </h2>
          <p className="text-sm md:text-base text-[#465664]">
            {language === "es"
              ? "Cuatro pilares de servicio diseñados para proteger tu patrimonio con fe notarial y total transparencia."
              : "Four pillars of service designed to protect your assets with legal certainty and full transparency."}
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* VISTA MÓVIL (< 768px): PESTAÑAS TÁCTILES + 1 TARJETA */}
        {/* ---------------------------------------------------- */}
        <div className="block md:hidden">
          {/* Selector superior de 4 pestañas táctiles (min-h 44px) */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-white rounded-2xl border border-[#DFE5EA] shadow-xs mb-5">
            {servicesData.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveMobileTab(idx)}
                className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-center text-center ${
                  activeMobileTab === idx
                    ? "bg-[#1B4965] text-white shadow-sm"
                    : "text-[#465664] hover:text-[#101B24] hover:bg-[#F7F8FA]"
                }`}
              >
                {s.tabLabel}
              </button>
            ))}
          </div>

          {/* Tarjeta completa activa */}
          {(() => {
            const current = servicesData[activeMobileTab];
            const IconComponent = current.icon;
            const isImss = current.id === "imss";

            return (
              <div
                className={`rounded-3xl border overflow-hidden shadow-md transition-all ${
                  isImss
                    ? "bg-[#1B4965] border-[#1B4965] text-white"
                    : "bg-white border-[#DFE5EA] text-[#101B24]"
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-[#1B4965] shadow-md">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <h3 className="font-heading font-bold text-xl leading-tight">
                    {current.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isImss ? "text-slate-200" : "text-[#465664]"}`}>
                    {current.description}
                  </p>

                  <ul className="space-y-2 pt-1 border-t border-black/10">
                    {current.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isImss ? "text-emerald-300" : "text-[#1B4965]"}`} />
                        <span className={isImss ? "text-slate-100" : "text-[#465664]"}>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={current.link}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm min-h-[48px] transition-all shadow-sm ${
                      isImss
                        ? "bg-white text-[#1B4965] hover:bg-slate-100"
                        : "bg-[#1B4965] text-white hover:bg-[#13374E]"
                    }`}
                  >
                    <span>{current.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ---------------------------------------------------- */}
        {/* VISTA ESCRITORIO (>= 768px): RETÍCULA ASIMÉTRICA BENTO */}
        {/* ---------------------------------------------------- */}
        <div className="hidden md:grid grid-cols-12 gap-6 items-stretch">
          {/* 1) Venta de Casas y Terrenos (7 cols, con foto superior 16:9) */}
          <div className="col-span-7 bg-white rounded-3xl border border-[#DFE5EA] shadow-xs hover:shadow-lg transition-all p-6 flex flex-col justify-between group">
            <div>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 bg-slate-100 relative">
                <img
                  src={servicesData[0].image}
                  alt={servicesData[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#1B4965] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  {language === "es" ? "Inmuebles Verificados" : "Verified Real Estate"}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#1B4965]/10 flex items-center justify-center text-[#1B4965]">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-[#101B24]">
                  {servicesData[0].title}
                </h3>
              </div>
              <p className="text-sm text-[#465664] mb-4">
                {servicesData[0].description}
              </p>
              <ul className="space-y-2 mb-6">
                {servicesData[0].features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[#465664]">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to={servicesData[0].link}
              className="inline-flex items-center justify-center gap-2 bg-[#1B4965] hover:bg-[#13374E] text-white py-3 px-6 rounded-xl font-bold text-sm transition-all"
            >
              <span>{servicesData[0].cta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2) Asesoría Legal Completa (5 cols, con foto 4:3) */}
          <div className="col-span-5 bg-white rounded-3xl border border-[#DFE5EA] shadow-xs hover:shadow-lg transition-all p-6 flex flex-col justify-between group">
            <div>
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 relative">
                <img
                  src={servicesData[1].image}
                  alt={servicesData[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#C8102E] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  {language === "es" ? "Poderes y Escrituras" : "Deeds & Powers"}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#1B4965]/10 flex items-center justify-center text-[#1B4965]">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#101B24]">
                  {servicesData[1].title}
                </h3>
              </div>
              <p className="text-xs text-[#465664] mb-4">
                {servicesData[1].description}
              </p>
              <ul className="space-y-2 mb-6">
                {servicesData[1].features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[#465664]">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to={servicesData[1].link}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F7F8FA] text-[#1B4965] border border-[#DFE5EA] py-3 px-6 rounded-xl font-bold text-sm transition-all"
            >
              <span>{servicesData[1].cta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3) IMSS e Infonavit Sin Fronteras (5 cols, tarjeta en alto contraste Azul Hogar Sereno #1B4965 con texto blanco y botón blanco) */}
          <div className="col-span-5 bg-[#1B4965] text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-md relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5 backdrop-blur-sm">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="inline-block bg-[#C8102E] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow">
                {language === "es" ? "Modalidad 40 y Crédito" : "Mod 40 & Credit"}
              </span>
              <h3 className="font-heading font-bold text-2xl text-white mb-3">
                {servicesData[2].title}
              </h3>
              <p className="text-sm text-slate-200 mb-6 leading-relaxed">
                {servicesData[2].description}
              </p>
              <ul className="space-y-2.5 mb-8">
                {servicesData[2].features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-100">
                    <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to={servicesData[2].link}
              className="relative z-10 inline-flex items-center justify-center gap-2 bg-white text-[#1B4965] hover:bg-slate-100 py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-md"
            >
              <span>{servicesData[2].cta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4) Alquiler de Casas y Terrenos (7 cols, tarjeta horizontal dividida: foto a la izquierda, texto y botón a la derecha) */}
          <div className="col-span-7 bg-white rounded-3xl border border-[#DFE5EA] shadow-xs hover:shadow-lg transition-all p-6 flex flex-col md:flex-row gap-6 items-center group">
            <div className="w-full md:w-1/2 h-full min-h-[220px] rounded-2xl overflow-hidden bg-slate-100 relative flex-shrink-0">
              <img
                src={servicesData[3].image}
                alt={servicesData[3].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#1B4965] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {language === "es" ? "Rentas Seguras" : "Secure Rentals"}
              </span>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1B4965]/10 flex items-center justify-center text-[#1B4965]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#101B24]">
                    {servicesData[3].title}
                  </h3>
                </div>
                <p className="text-xs text-[#465664] mb-3">
                  {servicesData[3].description}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {servicesData[3].features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[#465664]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to={servicesData[3].link}
                className="inline-flex items-center justify-center gap-2 bg-[#1B4965] hover:bg-[#13374E] text-white py-2.5 px-5 rounded-xl font-bold text-xs transition-all w-full"
              >
                <span>{servicesData[3].cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
