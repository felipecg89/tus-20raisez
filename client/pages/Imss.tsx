import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import {
  CheckCircle,
  FileText,
  Home,
  TrendingUp,
  Clock,
  Users,
  Shield,
  ChevronDown,
} from "lucide-react";

export default function Imss() {
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const content = {
    es: {
      title: "IMSS e Infonavit Sin Fronteras",
      subtitle:
        "Soluciones de seguridad social y crédito hipotecario para paisanos desde Estados Unidos",
      section1: {
        title: "¿Qué es IMSS Sin Fronteras?",
        description:
          "El IMSS (Instituto Mexicano del Seguro Social) ofrece dos modalidades especiales para mexicanos que viven en el extranjero y desean mantener cobertura de seguridad social en México.",
      },
      modalidad40: {
        title: "Modalidad 40 - Seguros Voluntarios",
        description:
          "Dirigida a personas que no tienen relación laboral con un patrón en México pero desean cotizar voluntariamente al IMSS.",
        benefits: [
          "Cobertura integral de salud",
          "Pensión por cesantía en edad avanzada y vejez",
          "Invalidez y vida",
          "Servicios médicos en cualquier clínica del IMSS",
          "Acceso a medicinas y tratamientos",
        ],
        requirements: [
          "Ser mexicano",
          "Estar en el extranjero",
          "Contar con documentos de identidad válidos",
          "Capacidad de pago de cuotas mensuales",
        ],
        cost: "Aproximadamente $800 - $1,200 USD al año (varía según salario base)",
      },
      modalidad44: {
        title: "Modalidad 44 - Trabajadores Independientes/Autoempleados",
        description:
          "Diseñada para profesionales independientes, microempresarios y trabajadores por cuenta propia que quieren protección integral.",
        benefits: [
          "Prestaciones de salud completas",
          "Incapacidad temporal y permanente",
          "Guarderías para hijos",
          "Servicios de farmacia",
          "Derechohabiente para familia",
          "Seguro de vida",
        ],
        requirements: [
          "Demostrar ingresos independientes",
          "Identificación oficial vigente",
          "Comprobante de domicilio",
          "RFC del contribuyente",
          "Estar en el extranjero (paisano)",
        ],
        cost: "Aproximadamente $2,000 - $3,500 USD al año (según ingresos declarados)",
      },
      infonavit: {
        title: "Infonavit Sin Fronteras - Crédito Hipotecario",
        description:
          "Programa que permite a trabajadores mexicanos en Estados Unidos acceder a crédito hipotecario para comprar o construir vivienda en México.",
        keyPoints: [
          "Crédito de hasta 750,000 pesos (o equivalente)",
          "Plazo hasta 30 años",
          "Tasas competitivas",
          "Pueden comprar vivienda para vivir o invertir",
          "No requiere visa",
          "Disponible para pareja/familia",
        ],
        requirements: [
          "Ser mexicano",
          "Tener crédito laboral con Infonavit",
          "No tener vivienda financiada por Infonavit en México",
          "Comprobar ingresos en EE.UU.",
          "Pasar evaluación crediticia",
        ],
        process: [
          "1. Verificar derechos ante Infonavit",
          "2. Abrir expediente Sin Fronteras",
          "3. Completar evaluación financiera",
          "4. Aprobación del crédito",
          "5. Búsqueda y selección de propiedad",
          "6. Formalización de escritura",
        ],
      },
    },
    en: {
      title: "IMSS and Infonavit for Abroad",
      subtitle:
        "Social security and mortgage credit solutions for Mexicans living in the United States",
      section1: {
        title: "What is IMSS for Abroad?",
        description:
          "The IMSS (Mexican Social Security Institute) offers special programs for Mexicans living abroad who want to maintain social security coverage in Mexico.",
      },
      modalidad40: {
        title: "Mode 40 - Voluntary Insurance",
        description:
          "For people without employment in Mexico who want to voluntarily contribute to IMSS.",
        benefits: [
          "Complete health coverage",
          "Pension for old age and unemployment",
          "Disability and life insurance",
          "Medical services at any IMSS clinic",
          "Access to medicines and treatments",
        ],
        requirements: [
          "Be Mexican",
          "Be living abroad",
          "Have valid identity documents",
          "Ability to pay monthly fees",
        ],
        cost: "Approximately $800 - $1,200 USD per year (varies by base salary)",
      },
      modalidad44: {
        title: "Mode 44 - Self-Employed/Independent Workers",
        description:
          "For independent professionals, microentrepreneurs and self-employed workers who want comprehensive protection.",
        benefits: [
          "Complete health benefits",
          "Temporary and permanent disability",
          "Childcare services",
          "Pharmacy services",
          "Family beneficiary coverage",
          "Life insurance",
        ],
        requirements: [
          "Prove independent income",
          "Current official identification",
          "Proof of residence",
          "Taxpayer RFC",
          "Be living abroad (paisano)",
        ],
        cost: "Approximately $2,000 - $3,500 USD per year (based on declared income)",
      },
      infonavit: {
        title: "Infonavit for Abroad - Mortgage Credit",
        description:
          "Program that allows Mexican workers in the United States to access mortgage credit to buy or build homes in Mexico.",
        keyPoints: [
          "Credit up to 750,000 pesos (or equivalent)",
          "Terms up to 30 years",
          "Competitive rates",
          "Can buy homes to live in or invest",
          "No visa required",
          "Available for couple/family",
        ],
        requirements: [
          "Be Mexican",
          "Have work credit with Infonavit",
          "Not have IMSS-financed housing in Mexico",
          "Prove income in USA",
          "Pass credit evaluation",
        ],
        process: [
          "1. Verify rights with Infonavit",
          "2. Open Abroad file",
          "3. Complete financial evaluation",
          "4. Credit approval",
          "5. Property search and selection",
          "6. Deed formalization",
        ],
      },
    },
  };

  const lang = language === "es" ? content.es : content.en;

  const faqItems = [
    {
      id: "1",
      question:
        language === "es"
          ? "¿Cuánto tiempo tarda el trámite?"
          : "How long does the process take?",
      answer:
        language === "es"
          ? "El proceso de IMSS toma entre 10-15 días hábiles. Infonavit puede tomar 30-60 días desde solicitud hasta aprobación."
          : "The IMSS process takes 10-15 business days. Infonavit can take 30-60 days from application to approval.",
    },
    {
      id: "2",
      question:
        language === "es"
          ? "¿Puedo solicitar desde Estados Unidos?"
          : "Can I apply from the United States?",
      answer:
        language === "es"
          ? "Sí, completamente. Todo el proceso se puede hacer de forma remota. Nosotros nos encargamos de la gestión completa."
          : "Yes, completely. The entire process can be done remotely. We handle the complete process.",
    },
    {
      id: "3",
      question:
        language === "es"
          ? "¿Qué documentos necesito?"
          : "What documents do I need?",
      answer:
        language === "es"
          ? "Pasaporte, RFC, comprobante de domicilio en México, prueba de ingresos en EE.UU. (estados de cuenta bancarios o cartas de empleador)."
          : "Passport, RFC, proof of Mexican address, proof of US income (bank statements or employment letters).",
    },
    {
      id: "4",
      question:
        language === "es"
          ? "¿Cuál es la diferencia entre Modalidad 40 y 44?"
          : "What is the difference between Mode 40 and 44?",
      answer:
        language === "es"
          ? "Modalidad 40 es para quienes NO tienen ingresos verificables y es más barata. Modalidad 44 es para trabajadores independientes con ingresos documentados."
          : "Mode 40 is for those WITHOUT verifiable income and is cheaper. Mode 44 is for independent workers with documented income.",
    },
    {
      id: "5",
      question:
        language === "es"
          ? "¿Cuándo puedo usar Infonavit Sin Fronteras?"
          : "When can I use Infonavit for Abroad?",
      answer:
        language === "es"
          ? "Una vez que tengas al menos 1-2 años de crédito activo en Infonavit y cumplas los requisitos de antigüedad laboral."
          : "Once you have at least 1-2 years of active Infonavit credit and meet employment tenure requirements.",
    },
  ];

  const timeline = [
    {
      step: language === "es" ? "Consulta Inicial" : "Initial Consultation",
      description:
        language === "es"
          ? "Evaluamos tu caso y definimos la mejor modalidad para ti"
          : "We evaluate your case and define the best option for you",
      icon: Users,
    },
    {
      step: language === "es" ? "Documentación" : "Documentation",
      description:
        language === "es"
          ? "Recopilamos todos los documentos necesarios"
          : "We gather all necessary documents",
      icon: FileText,
    },
    {
      step: language === "es" ? "Solicitud Oficial" : "Official Application",
      description:
        language === "es"
          ? "Presentamos la solicitud ante IMSS o Infonavit"
          : "We submit the application to IMSS or Infonavit",
      icon: CheckCircle,
    },
    {
      step:
        language === "es" ? "Seguimiento y Aprobación" : "Follow-up & Approval",
      description:
        language === "es"
          ? "Monitoreamos el trámite hasta obtener la aprobación final"
          : "We monitor the process until final approval",
      icon: TrendingUp,
    },
  ];

  const whyChooseUs = [
    {
      title: language === "es" ? "Expertos Certificados" : "Certified Experts",
      description:
        language === "es"
          ? "Nuestro equipo tiene años de experiencia en IMSS e Infonavit"
          : "Our team has years of experience with IMSS and Infonavit",
      icon: Shield,
    },
    {
      title: language === "es" ? "Proceso 100% Remoto" : "100% Remote Process",
      description:
        language === "es"
          ? "Gestión completa desde Estados Unidos, sin necesidad de viajar"
          : "Complete management from the USA, no need to travel",
      icon: Clock,
    },
    {
      title:
        language === "es" ? "Transparencia en Costos" : "Transparent Costs",
      description:
        language === "es"
          ? "Sin sorpresas. Sabes exactamente qué pagas y cuándo"
          : "No surprises. Know exactly what you pay and when",
      icon: TrendingUp,
    },
    {
      title: language === "es" ? "Soporte en Español" : "Spanish Support",
      description:
        language === "es"
          ? "Atención personalizada en tu idioma durante todo el proceso"
          : "Personalized support in your language throughout",
      icon: Users,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {lang.title}
            </h1>
            <p className="text-lg text-foreground/70">{lang.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 space-y-20">
          {/* IMSS Introduction */}
          <section>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {lang.section1.title}
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                {lang.section1.description}
              </p>
            </div>
          </section>

          {/* Modalidad 40 & 44 Cards */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Modalidad 40 */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border p-8">
                <div className="inline-block bg-primary/20 p-3 rounded-lg mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {lang.modalidad40.title}
                </h3>
                <p className="text-foreground/70 mb-6">
                  {lang.modalidad40.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Beneficios:" : "Benefits:"}
                  </h4>
                  <ul className="space-y-2">
                    {lang.modalidad40.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/70">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Requisitos:" : "Requirements:"}
                  </h4>
                  <ul className="space-y-2">
                    {lang.modalidad40.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-foreground/70">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-lg border border-border">
                  <p className="text-sm text-foreground/60 mb-1">
                    {language === "es" ? "Costo Aproximado:" : "Approx. Cost:"}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {lang.modalidad40.cost}
                  </p>
                </div>
              </div>

              {/* Modalidad 44 */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border p-8">
                <div className="inline-block bg-primary/20 p-3 rounded-lg mb-4">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {lang.modalidad44.title}
                </h3>
                <p className="text-foreground/70 mb-6">
                  {lang.modalidad44.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Beneficios:" : "Benefits:"}
                  </h4>
                  <ul className="space-y-2">
                    {lang.modalidad44.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/70">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Requisitos:" : "Requirements:"}
                  </h4>
                  <ul className="space-y-2">
                    {lang.modalidad44.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        </div>
                        <span className="text-foreground/70">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-lg border border-border">
                  <p className="text-sm text-foreground/60 mb-1">
                    {language === "es" ? "Costo Aproximado:" : "Approx. Cost:"}
                  </p>
                  <p className="text-xl font-bold text-secondary">
                    {lang.modalidad44.cost}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Infonavit Sin Fronteras */}
          <section className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {lang.infonavit.title}
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              {lang.infonavit.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  {language === "es" ? "Puntos Clave:" : "Key Points:"}
                </h4>
                <ul className="space-y-3">
                  {lang.infonavit.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/70">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  {language === "es" ? "Proceso:" : "Process:"}
                </h4>
                <ul className="space-y-2">
                  {lang.infonavit.process.map((step, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-primary/10 rounded-lg text-foreground/80"
                    >
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section>
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              {language === "es" ? "Nuestro Proceso" : "Our Process"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {timeline.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === timeline.length - 1;
                return (
                  <div key={idx} className="relative">
                    {!isLast && (
                      <div className="hidden md:block absolute top-12 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-secondary"></div>
                    )}
                    <div className="bg-white rounded-2xl border border-border p-6 h-full hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/20">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-3xl font-bold text-primary/20">
                          {idx + 1}
                        </div>
                      </div>
                      <h4 className="font-bold text-foreground mb-2">
                        {item.step}
                      </h4>
                      <p className="text-sm text-foreground/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              {language === "es"
                ? "¿Por qué elegir Tus Raíces MX?"
                : "Why Choose Tus Raíces MX?"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {whyChooseUs.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">
                        {item.title}
                      </h4>
                      <p className="text-foreground/70">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              {language === "es"
                ? "Preguntas Frecuentes"
                : "Frequently Asked Questions"}
            </h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === item.id ? null : item.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-colors"
                  >
                    <span className="font-semibold text-foreground text-left">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary transition-transform ${
                        expandedFaq === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === item.id && (
                    <div className="px-6 py-4 bg-muted border-t border-border">
                      <p className="text-foreground/70">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "es"
                ? "¿Listo para proteger tu futuro en México?"
                : "Ready to Protect Your Future in Mexico?"}
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              {language === "es"
                ? "Nuestros expertos están listos para guiarte en cada paso. Agendar una consulta inicial es completamente gratis."
                : "Our experts are ready to guide you at every step. Schedule an initial consultation completely free."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors"
              >
                {language === "es" ? "Hablar por WhatsApp" : "Chat on WhatsApp"}
              </a>
              <a
                href="#contacto"
                className="bg-white/20 text-white border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white/30 transition-colors"
              >
                {language === "es" ? "Agendar Cita" : "Schedule Call"}
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
