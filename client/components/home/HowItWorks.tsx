import { useState } from "react";
import { PhoneCall, FileSearch, FileCheck2, KeyRound } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const HowItWorks = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      icon: PhoneCall,
      title: t.howItWorks.step1.title,
      description: t.howItWorks.step1.description,
      tip: language === "es" ? "Sin costo ni compromiso" : "Free initial consultation",
    },
    {
      num: "02",
      icon: FileSearch,
      title: t.howItWorks.step2.title,
      description: t.howItWorks.step2.description,
      tip: language === "es" ? "Dictamen técnico y legal" : "Technical and legal review",
    },
    {
      num: "03",
      icon: FileCheck2,
      title: t.howItWorks.step3.title,
      description: t.howItWorks.step3.description,
      tip: language === "es" ? "Poderes y fe notarial" : "Consular notary powers",
    },
    {
      num: "04",
      icon: KeyRound,
      title: t.howItWorks.step4.title,
      description: t.howItWorks.step4.description,
      tip: language === "es" ? "Certeza y entrega de llaves" : "Deed delivery & keys",
    },
  ];

  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-[#F7F8FA] border-b border-[#DFE5EA]">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-2">
          <p className="text-xs md:text-sm font-bold text-[#1B4965] uppercase tracking-wider">
            {language === "es" ? "Proceso Transparente y Seguro" : "Clear & Secure Process"}
          </p>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#101B24] tracking-tight">
            {language === "es" ? "Cómo logramos tu objetivo en 4 pasos" : "How it works in 4 easy steps"}
          </h2>
          <p className="text-sm md:text-base text-[#465664]">
            {language === "es"
              ? "Tú estás en EE. UU., nosotros nos encargamos de todo el trámite en México con reportes claros en cada etapa."
              : "You stay in the US, while we handle all ground operations in Mexico with full milestone reports."}
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* VISTA MÓVIL (< 768px): SELECTOR INTERACTIVO 01..04  */}
        {/* ---------------------------------------------------- */}
        <div className="block md:hidden">
          {/* Selector de 4 botones numéricos */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {steps.map((st, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`py-2 px-1 rounded-2xl font-mono text-sm font-bold min-h-[44px] transition-all flex flex-col items-center justify-center border ${
                  activeStep === idx
                    ? "bg-[#1B4965] text-white border-[#1B4965] shadow-md scale-102"
                    : "bg-white text-[#465664] border-[#DFE5EA] hover:bg-slate-50"
                }`}
              >
                <span>{st.num}</span>
              </button>
            ))}
          </div>

          {/* Tarjeta de detalle de 1 paso a la vez */}
          {(() => {
            const step = steps[activeStep];
            const StepIcon = step.icon;
            return (
              <div className="bg-white rounded-3xl border border-[#DFE5EA] p-6 shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#1B4965]/10 flex items-center justify-center text-[#1B4965]">
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-bold text-3xl text-[#1B4965]/30">
                    {step.num}
                  </span>
                </div>

                <div>
                  <span className="inline-block text-[11px] font-bold text-[#C8102E] uppercase tracking-wider mb-1">
                    {step.tip}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-[#101B24] leading-snug">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs text-[#465664] leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-2 flex justify-between items-center text-xs text-[#465664] border-t border-[#DFE5EA]">
                  <span>{language === "es" ? `Paso ${activeStep + 1} de 4` : `Step ${activeStep + 1} of 4`}</span>
                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % 4)}
                    className="font-bold text-[#1B4965] hover:underline"
                  >
                    {language === "es" ? "Siguiente paso →" : "Next step →"}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ---------------------------------------------------- */}
        {/* VISTA ESCRITORIO (>= 768px): 4 COLUMNAS HORIZONTALES */}
        {/* ---------------------------------------------------- */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl border border-[#DFE5EA] p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#1B4965]/10 group-hover:bg-[#1B4965] group-hover:text-white flex items-center justify-center text-[#1B4965] transition-colors">
                      <StepIcon className="w-6 h-6" />
                    </div>
                    {/* Numeración grande en fuente monoespaciada */}
                    <span className="font-mono font-extrabold text-3xl text-[#DFE5EA] group-hover:text-[#1B4965]/40 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <div>
                    <span className="inline-block text-[11px] font-bold text-[#C8102E] uppercase tracking-wider mb-1">
                      {step.tip}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-[#101B24] leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#465664] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
