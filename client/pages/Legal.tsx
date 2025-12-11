import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LawyerProfile } from "@/components/LawyerProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import {
  CheckCircle,
  FileText,
  Home,
  Heart,
  TrendingUp,
  DollarSign,
  Briefcase,
  ChevronDown,
  Scale,
} from "lucide-react";

export default function Legal() {
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState(0);

  const content = {
    es: {
      title: "Asesoría Legal Profesional",
      subtitle:
        "Representación legal especializada para paisanos en todos tus trámites en México",
      intro:
        "Contamos con un equipo de abogados certificados con experiencia en los temas que más importan a nuestros paisanos. Desde herencias hasta impuestos, estamos aquí para proteger tus derechos.",
      services: [
        {
          id: "1",
          title: "Herencias y Sucesiones",
          icon: "📋",
          description:
            "Asesoramiento completo en procesos de herencia, testamentaría y distribución de bienes",
          details: [
            "Trámite de testamentaría en México",
            "División de patrimonios y bienes",
            "Representación ante notarios",
            "Resolución de conflictos sucesorios",
            "Impuestos sobre herencias",
          ],
          timeframe:
            language === "es" ? "Generalmente 3-6 meses" : "Usually 3-6 months",
          commonIssues: [
            "Hermanos disputando herencia",
            "Testamento no actualizado",
            "Bienes en varios estados",
            "Deudas del difunto",
          ],
        },
        {
          id: "2",
          title: "Poderes Notariales",
          icon: "⚖️",
          description:
            "Otorgamiento y gestión de poderes notariales para actos en México",
          details: [
            "Poder especial para venta de propiedades",
            "Poder general de administración",
            "Poder para asuntos fiscales",
            "Poder para litigios",
            "Revocación de poderes previos",
          ],
          timeframe:
            language === "es" ? "5-10 días hábiles" : "5-10 business days",
          commonIssues: [
            "Vender propiedad desde EE.UU.",
            "Representación en trámites",
            "Administración de negocios",
            "Gestión de cuentas bancarias",
          ],
        },
        {
          id: "3",
          title: "Trámites Fiscales e Impuestos",
          icon: "💰",
          description:
            "Asesoramiento en obligaciones fiscales y optimización tributaria en México",
          details: [
            "Declaración anual de impuestos",
            "Registro Federal de Contribuyentes (RFC)",
            "Cumplimiento de obligaciones fiscales",
            "Deducibilidad de gastos",
            "Controversias con el SAT",
          ],
          timeframe:
            language === "es"
              ? "Trámites de 3-4 semanas"
              : "Procedures of 3-4 weeks",
          commonIssues: [
            "Renta de inmuebles en México",
            "Impuestos por venta de propiedad",
            "Remesas y divisas",
            "Multas del SAT",
          ],
        },
        {
          id: "4",
          title: "Compra-Venta de Propiedades",
          icon: "🏠",
          description:
            "Asesoramiento integral en transacciones inmobiliarias desde Estados Unidos",
          details: [
            "Investigación de titularidad de propiedad",
            "Revisión de documentos y contratos",
            "Representación en notaría",
            "Registro de propiedad",
            "Revisión de avalúos",
          ],
          timeframe:
            language === "es"
              ? "Proceso de 30-45 días"
              : "Process of 30-45 days",
          commonIssues: [
            "Propiedad heredada sin documentar",
            "Compra a distancia",
            "Permisos en zonas restringidas",
            "Fraude en documentos",
          ],
        },
        {
          id: "5",
          title: "Registro Civil y Familia",
          icon: "❤️",
          description:
            "Trámites de estado civil, matrimonios, divorcios y paternidad",
          details: [
            "Corrección de actas de nacimiento",
            "Matrimonios en el extranjero",
            "Divorcios en línea",
            "Reconocimiento de paternidad",
            "Custodia y pensión alimenticia",
          ],
          timeframe:
            language === "es"
              ? "Según trámite, 15 a 60 días"
              : "Depending on procedure, 15-60 days",
          commonIssues: [
            "Errores en acta de nacimiento",
            "Matrimonio no reconocido",
            "Divorcio con hijos",
            "Pensión alimenticia",
          ],
        },
        {
          id: "6",
          title: "Constitucion de Empresas",
          icon: "💼",
          description:
            "Asesoramiento para crear y formalizar negocios en México",
          details: [
            "Constitución de sociedades mercantiles",
            "Registro de marca y patentes",
            "Licencias y permisos",
            "Restructuración empresarial",
            "Disolución de empresas",
          ],
          timeframe:
            language === "es"
              ? "Constitución en 7-10 días"
              : "Formation in 7-10 days",
          commonIssues: [
            "Negocio familiar sin estructura",
            "Permiso de operación",
            "Conflictos entre socios",
            "Cambio de giro empresarial",
          ],
        },
        {
          id: "7",
          title: "Jubilaciones",
          icon: "🎯",
          description:
            "Asesoramiento integral en procesos de jubilación y trámites relacionados",
          details: [
            "Solicitud de jubilación anticipada",
            "Tramitación ante IMSS e INFONAVIT",
            "Documentación y acreditación",
            "Gestión de beneficios",
            "Asesoría de opciones de jubilación",
          ],
          timeframe:
            language === "es" ? "Proceso de 2-3 meses" : "Process of 2-3 months",
          commonIssues: [
            "Requisitos no claros",
            "Documentos incompletos",
            "Resolución de conflictos con institución",
            "Cálculo de montos",
          ],
        },
        {
          id: "8",
          title: "Pensiones",
          icon: "💳",
          description:
            "Gestión de derechos y trámites de pensiones para trabajadores y dependientes",
          details: [
            "Pensiones de vejez",
            "Pensiones de invalidez",
            "Pensiones de viudez",
            "Orfandad y ascendientes",
            "Revisión de montos de pensión",
          ],
          timeframe:
            language === "es" ? "Según el tipo, 30-60 días" : "Depending on type, 30-60 days",
          commonIssues: [
            "Pensión no actualizada",
            "Errores en cálculo",
            "Falta de documentación",
            "Derechos herederos",
          ],
        },
        {
          id: "9",
          title: "Retiros",
          icon: "📊",
          description:
            "Asesoramiento en retiros de fondos de ahorro y planes de pensión",
          details: [
            "Retiro de fondo de ahorro para el retiro (SAR)",
            "Retiro anticipado de fondos",
            "Tramitación con afore",
            "Gestión de documentación",
            "Asesoría fiscal en retiros",
          ],
          timeframe:
            language === "es" ? "Procesamiento 10-20 días" : "Processing 10-20 days",
          commonIssues: [
            "Retrasos en acreditación",
            "Requisitos de edad",
            "Afiliación irregular",
            "Dispersión de cuentas",
          ],
        },
        {
          id: "10",
          title: "Indemnizaciones",
          icon: "⚡",
          description:
            "Asesoramiento en cálculo, gestión y cobro de indemnizaciones laborales",
          details: [
            "Indemnización por despido injustificado",
            "Cálculo de prestaciones",
            "Negociación con empleador",
            "Litigio laboral si es necesario",
            "Cobro de liquidación",
          ],
          timeframe:
            language === "es" ? "Según el caso, 1-6 meses" : "Depending on case, 1-6 months",
          commonIssues: [
            "Cálculo incorrecto de prestaciones",
            "Empleador rehúsa pagar",
            "Falta de documentación laboral",
            "Despido por represalia",
          ],
        },
      ],
    },
    en: {
      title: "Professional Legal Advice",
      subtitle:
        "Specialized legal representation for Mexicans abroad in all your Mexico procedures",
      intro:
        "We have a team of certified lawyers with experience in the issues that matter most to our paisanos. From inheritances to taxes, we are here to protect your rights.",
      services: [
        {
          id: "1",
          title: "Inheritances and Successions",
          icon: "📋",
          description:
            "Complete guidance in inheritance processes, wills and asset distribution",
          details: [
            "Will probate procedure in Mexico",
            "Patrimony and asset division",
            "Representation before notaries",
            "Resolution of succession conflicts",
            "Inheritance taxes",
          ],
          timeframe: "Usually 3-6 months",
          commonIssues: [
            "Siblings disputing inheritance",
            "Outdated will",
            "Assets in multiple states",
            "Debts of the deceased",
          ],
        },
        {
          id: "2",
          title: "Notary Powers",
          icon: "⚖️",
          description:
            "Granting and management of notary powers for acts in Mexico",
          details: [
            "Special power for property sales",
            "General power of administration",
            "Power for tax matters",
            "Power for litigation",
            "Revocation of previous powers",
          ],
          timeframe: "5-10 business days",
          commonIssues: [
            "Sell property from USA",
            "Representation in procedures",
            "Business administration",
            "Management of bank accounts",
          ],
        },
        {
          id: "3",
          title: "Tax and Finance Procedures",
          icon: "💰",
          description:
            "Advice on tax obligations and tax optimization in Mexico",
          details: [
            "Annual tax return",
            "Federal Taxpayer Registry (RFC)",
            "Compliance with tax obligations",
            "Deductibility of expenses",
            "Disputes with tax authority",
          ],
          timeframe: "Procedures of 3-4 weeks",
          commonIssues: [
            "Real estate rental income",
            "Taxes on property sales",
            "Remittances and currency",
            "Tax authority fines",
          ],
        },
        {
          id: "4",
          title: "Property Purchase and Sale",
          icon: "🏠",
          description:
            "Comprehensive advice on real estate transactions from the United States",
          details: [
            "Investigation of property ownership",
            "Review of documents and contracts",
            "Representation at notary",
            "Property registration",
            "Review of appraisals",
          ],
          timeframe: "Process of 30-45 days",
          commonIssues: [
            "Inherited property undocumented",
            "Purchase from distance",
            "Permits in restricted areas",
            "Document fraud",
          ],
        },
        {
          id: "5",
          title: "Civil Registry and Family",
          icon: "❤️",
          description:
            "Civil status procedures, marriages, divorces and paternity",
          details: [
            "Correction of birth certificates",
            "Marriages abroad",
            "Online divorces",
            "Acknowledgment of paternity",
            "Custody and child support",
          ],
          timeframe: "Depending on procedure, 15-60 days",
          commonIssues: [
            "Errors in birth certificate",
            "Marriage not recognized",
            "Divorce with children",
            "Child support",
          ],
        },
        {
          id: "6",
          title: "Business Formation",
          icon: "💼",
          description:
            "Advice for creating and formalizing businesses in Mexico",
          details: [
            "Formation of commercial companies",
            "Trademark and patent registration",
            "Licenses and permits",
            "Business restructuring",
            "Business dissolution",
          ],
          timeframe: "Formation in 7-10 days",
          commonIssues: [
            "Family business without structure",
            "Operating permit",
            "Conflicts between partners",
            "Change of business activity",
          ],
        },
      ],
    },
  };

  const lang = language === "es" ? content.es : content.en;
  const currentService = lang.services[selectedService];

  const faqItems = [
    {
      id: "1",
      question:
        language === "es"
          ? "¿Necesito viajar a México para un trámite legal?"
          : "Do I need to travel to Mexico for a legal procedure?",
      answer:
        language === "es"
          ? "No necesariamente. Muchos trámites se pueden hacer remotamente con un poder notarial. Nuestro equipo maneja la representación en México."
          : "Not necessarily. Many procedures can be done remotely with a notary power. Our team handles representation in Mexico.",
    },
    {
      id: "2",
      question:
        language === "es"
          ? "¿Cuáles son los honorarios legales?"
          : "What are the legal fees?",
      answer:
        language === "es"
          ? "Los honorarios varían según el tipo de trámite y complejidad. Ofrecemos consulta inicial gratis y presupuesto transparente sin sorpresas."
          : "Fees vary depending on the type of procedure and complexity. We offer a free initial consultation and transparent pricing with no surprises.",
    },
    {
      id: "3",
      question:
        language === "es"
          ? "¿Cuánto tiempo toma un trámite legal?"
          : "How long does a legal procedure take?",
      answer:
        language === "es"
          ? "Depende del trámite. Herencias: 3-6 meses. Poderes: 5-10 días. Propiedades: 30-45 días. Los plazos son aproximados y pueden variar."
          : "It depends on the procedure. Inheritances: 3-6 months. Powers: 5-10 days. Properties: 30-45 days. Timeframes are approximate and may vary.",
    },
    {
      id: "4",
      question: language === "es" ? "¿Hablan inglés?" : "Do you speak English?",
      answer:
        language === "es"
          ? "Sí, contamos con abogados bilingües. La atención puede ser en español o inglés según tu preferencia."
          : "Yes, we have bilingual lawyers. We can assist you in Spanish or English according to your preference.",
    },
    {
      id: "5",
      question:
        language === "es"
          ? "¿Qué documento necesito para otorgar un poder?"
          : "What document do I need to grant a power of attorney?",
      answer:
        language === "es"
          ? "Necesitas: Pasaporte/ID, Acta de nacimiento, Comprobante de domicilio en EE.UU., y fotocopia de tu visa o permiso de residencia."
          : "You need: Passport/ID, Birth certificate, Proof of address in USA, and copy of your visa or residence permit.",
    },
  ];

  const benefits = [
    {
      title: language === "es" ? "Abogados Certificados" : "Certified Lawyers",
      description:
        language === "es"
          ? "Especialistas en derecho migratorio, familiar y civil"
          : "Specialists in migration, family and civil law",
      icon: Scale,
    },
    {
      title:
        language === "es" ? "Representación Completa" : "Full Representation",
      description:
        language === "es"
          ? "Nos encargamos de todo, desde documentación hasta formalización"
          : "We handle everything from documentation to finalization",
      icon: Briefcase,
    },
    {
      title: language === "es" ? "Proceso Remoto" : "Remote Process",
      description:
        language === "es"
          ? "Gestiona tus trámites sin salir de Estados Unidos"
          : "Manage your procedures without leaving the United States",
      icon: Home,
    },
    {
      title: language === "es" ? "Confidencialidad" : "Confidentiality",
      description:
        language === "es"
          ? "Tus datos y asuntos legales están protegidos bajo secreto profesional"
          : "Your data and legal matters are protected by attorney-client privilege",
      icon: FileText,
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
            <p className="text-lg text-foreground/70 mb-4">{lang.subtitle}</p>
            <p className="text-foreground/60">{lang.intro}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 space-y-20">
          {/* Services Overview */}
          <section>
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              {language === "es"
                ? "Servicios Legales por Tema"
                : "Legal Services by Topic"}
            </h2>

            {/* Service Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {lang.services.map((service, idx) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(idx)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    selectedService === idx
                      ? "border-primary bg-primary/10"
                      : "border-border bg-white hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <p className="font-semibold text-foreground text-sm line-clamp-2">
                    {service.title}
                  </p>
                </button>
              ))}
            </div>

            {/* Service Details */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">{currentService.icon}</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-foreground mb-2">
                    {currentService.title}
                  </h3>
                  <p className="text-lg text-foreground/70 mb-4">
                    {currentService.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 text-sm">
                    <div>
                      <p className="text-foreground/60 mb-1">
                        {language === "es"
                          ? "Plazo estimado:"
                          : "Estimated timeframe:"}
                      </p>
                      <p className="font-semibold text-primary">
                        {currentService.timeframe}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details and Common Issues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">
                    {language === "es" ? "Lo que hacemos:" : "What we do:"}
                  </h4>
                  <ul className="space-y-3">
                    {currentService.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/70">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-4">
                    {language === "es"
                      ? "Problemas comunes:"
                      : "Common issues:"}
                  </h4>
                  <ul className="space-y-3">
                    {currentService.commonIssues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        </div>
                        <span className="text-foreground/70">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Lawyer Profile - Hero Section */}
          <section className="py-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              {language === "es"
                ? "Tu Especialista Legal"
                : "Your Legal Specialist"}
            </h2>
            <LawyerProfile />
          </section>

          {/* Why Choose Us */}
          <section>
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              {language === "es" ? "¿Por qué elegirnos?" : "Why choose us?"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-border p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-foreground/70">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-3xl mx-auto w-full">
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
          <section className="bg-gradient-turquoise-sky rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "es"
                ? "¿Necesitas Asesoría Legal?"
                : "Do You Need Legal Advice?"}
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              {language === "es"
                ? "Contacta con nuestro especialista Lic. Sergio García para una consulta inicial completamente gratis."
                : "Contact our specialist Lic. Sergio García for a completely free initial consultation."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors"
              >
                {language === "es"
                  ? "Contactar por WhatsApp"
                  : "Contact via WhatsApp"}
              </a>
              <a
                href="#contacto"
                className="bg-white/20 text-white border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white/30 transition-colors"
              >
                {language === "es"
                  ? "Agendar Consulta"
                  : "Schedule Consultation"}
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
