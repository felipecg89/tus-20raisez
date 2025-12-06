import { Star, Phone, MessageCircle, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const LawyerProfile = () => {
  const { language } = useLanguage();

  const profile = {
    es: {
      name: "Lic. Sergio García Mendoza",
      title: "Especialista en Derecho Migratorio y Familiar",
      experience: "18+ años de experiencia",
      credentials: [
        "Lic. en Derecho - UNAM",
        "Certificado en Derecho Migratorio",
        "Miembro del Colegio de Abogados",
      ],
      expertise: [
        "Herencias y Sucesiones",
        "Poderes Notariales",
        "Trámites Fiscales",
        "Compra-Venta de Propiedades",
      ],
      rating: 4.9,
      reviews: 145,
      cta: "Agendar Consulta Inicial",
      contactText: "Primera consulta: Completamente GRATIS",
    },
    en: {
      name: "Lic. Sergio García Mendoza",
      title: "Specialist in Migration and Family Law",
      experience: "18+ years of experience",
      credentials: [
        "Law Degree - UNAM",
        "Migration Law Certificate",
        "Member of Bar Association",
      ],
      expertise: [
        "Inheritances & Successions",
        "Notary Powers",
        "Tax Procedures",
        "Property Purchase & Sale",
      ],
      rating: 4.9,
      reviews: 145,
      cta: "Schedule Initial Consultation",
      contactText: "First consultation: Completely FREE",
    },
  };

  const data = language === "es" ? profile.es : profile.en;

  return (
    <div className="bg-white rounded-2xl border-2 border-primary/20 p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-7xl shadow-lg">
              ⚖️
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-3 shadow-lg">
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
              {data.rating} ({data.reviews} {language === "es" ? "reseñas" : "reviews"})
            </span>
          </div>

          {/* Credentials */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3">
              {language === "es" ? "Credenciales:" : "Credentials:"}
            </h4>
            <ul className="space-y-1">
              {data.credentials.map((cred, idx) => (
                <li key={idx} className="flex items-center gap-2 text-foreground/70">
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
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {language === "es" ? "WhatsApp" : "WhatsApp"}
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {language === "es" ? "Llamar" : "Call"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckMark = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
