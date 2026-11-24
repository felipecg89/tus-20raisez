import { Star, Phone, MessageCircle, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CALL_US_DISPLAY,
  CALL_US_LABEL_ES,
  CALL_US_LABEL_EN,
  getWhatsAppUrl,
  getCallUrl,
  buildWhatsAppContextMessage,
} from "@/config/contact";

export const LawyerProfile = () => {
  const { language } = useLanguage();

  const profile = {
    es: {
      name: "Lic. María Elena Ortiz",
      title: "Especialista en Derecho Notarial, Inmobiliario y Migratorio",
      experience: "18+ años de experiencia protegiendo el patrimonio de paisanos",
      credentials: [
        "Lic. en Derecho - UNAM (Mención Honorífica)",
        "Especialidad en Derecho Notarial e Inmobiliario",
        "Miembro del Colegio Nacional del Notariado Mexicano",
      ],
      expertise: [
        "Escrituración y Contratos de Compraventa",
        "Poderes Notariales Consulares en EE. UU.",
        "Herencias, Sucesiones y Testamentos",
        "Regularización de Títulos y Propiedades",
      ],
      rating: 4.9,
      reviews: 145,
      cta: "Agendar Consulta Inicial",
      contactText: "Primera consulta: Completamente GRATIS",
    },
    en: {
      name: "Lic. María Elena Ortiz",
      title: "Specialist in Notary, Real Estate & Cross-Border Law",
      experience: "18+ years of experience protecting families' assets across borders",
      credentials: [
        "Law Degree - UNAM (Honors)",
        "Notary & Real Estate Law Specialization",
        "Member of the National Mexican Notary Bar",
      ],
      expertise: [
        "Deeds & Real Estate Sales Contracts",
        "Consular Notary Powers drafted in the US",
        "Inheritances, Successions & Wills",
        "Title Regularization & Land Registry",
      ],
      rating: 4.9,
      reviews: 145,
      cta: "Schedule Initial Consultation",
      contactText: "First consultation: Completely FREE",
    },
  };

  const data = language === "es" ? profile.es : profile.en;

  return (
    <div className="bg-white rounded-2xl border-2 border-primary/20 p-5 sm:p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src="/images/abogada-notaria.jpg"
              alt={data.name}
              className="w-36 h-36 md:w-44 md:h-44 rounded-2xl object-cover object-top shadow-xl border-2 border-primary/20"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-2.5 shadow-lg border-2 border-white">
              <CheckMark />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            {data.name}
          </h3>
          <p className="text-primary font-semibold mb-2">{data.title}</p>
          <p className="text-foreground/70 mb-4">{data.experience}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(data.rating)
                    ? "fill-secondary text-secondary"
                    : "text-secondary/30"
                }`}
              />
            ))}
            <span className="text-sm text-foreground/70">
              {data.rating} ({data.reviews}{" "}
              {language === "es" ? "reseñas" : "reviews"})
            </span>
          </div>

          {/* Credentials */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3">
              {language === "es" ? "Credenciales:" : "Credentials:"}
            </h4>
            <ul className="space-y-1">
              {data.credentials.map((cred, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-foreground/70"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  {cred}
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3">
              {language === "es" ? "Especialidades:" : "Expertise:"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.expertise.map((exp, idx) => (
                <span
                  key={idx}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">
              {data.contactText}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppUrl(
                  buildWhatsAppContextMessage({
                    service: language === "es" ? "Asesoría Legal con Lic. Sergio García" : "Legal Advisory with Attorney Sergio García",
                  })
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Business</span>
              </a>
              <a
                href={getCallUrl("us")}
                className="flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-lg font-bold hover:bg-primary/5 transition-colors"
                title={language === "es" ? CALL_US_LABEL_ES : CALL_US_LABEL_EN}
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{language === "es" ? `Llamar Gratis ${CALL_US_DISPLAY}` : `Call Toll-Free ${CALL_US_DISPLAY}`}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckMark = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
