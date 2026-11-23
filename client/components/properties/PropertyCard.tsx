import { MapPin, Home, Bath, Maximize2, MessageCircle, Eye, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { getWhatsAppUrl, buildWhatsAppContextMessage } from "@/config/contact";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  image?: string;
  type: string;
  capacity?: number;
  rentalPeriod?: string;
}

export const PropertyCard = ({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  description,
  image,
  type,
  capacity,
  rentalPeriod,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const { exchangeRate } = useExchangeRate();

  const formatPrice = (price: number) => {
    if (language === "es") {
      // Show in MXN for Spanish
      const priceInMXN = price * exchangeRate;
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }).format(priceInMXN);
    } else {
      // Show in USD for English
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(price);
    }
  };

  const handleViewDetails = () => {
    navigate(`/casas/${id}`);
  };

  const handleWhatsApp = () => {
    const text =
      language === "es"
        ? `Hola, vivo en EE.UU. y me interesa la propiedad "${title}" en ${location} (Precio: ${formatPrice(price)}). ¿Tienen opciones de compra o financiamiento para paisanos?`
        : `Hello, I live in the US and I'm interested in the property "${title}" in ${location} (${formatPrice(price)}). Do you offer payment or financing options for US buyers?`;
    window.open(getWhatsAppUrl(text), "_blank");
  };

  return (
    <div className="bg-white border border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group md:rounded-2xl">
      {/* Image - Full Width on Mobile */}
      <div className="relative h-52 sm:h-56 md:h-64 overflow-hidden bg-slate-100 flex items-center justify-center">
        <img
          src={
            image ||
            (type === "terreno"
              ? "/images/terreno-residencial-mexico.jpg"
              : "/images/casa-mexico-fachada.jpg")
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {type === "salon_fiestas" && (
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
              Salón de Fiestas
            </span>
          )}
          {type === "comercio" && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
              Comercial
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-[#1B4965] text-white px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-lg font-bold text-xs sm:text-sm md:text-base shadow-md">
          {formatPrice(price)} {rentalPeriod === "evento" ? "/ Evento" : ""}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-6">
        {/* Title - Prominent on Mobile */}
        <h3 className="text-sm md:text-xl font-bold text-[#101B24] mb-2 md:mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[#465664] mb-3 md:mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#1B4965] flex-shrink-0" />
          <span className="text-xs md:text-sm font-medium line-clamp-1">{location}</span>
        </div>

        {/* Description - Hidden on Mobile */}
        <p className="hidden md:block text-[#465664] text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Features - Always Show */}
        <div className="hidden md:grid grid-cols-3 gap-3 py-3 md:py-4 border-y border-slate-100 mb-4">
          {type === "salon_fiestas" || (type === "comercio" && capacity) ? (
            <div className="text-center col-span-2">
              <div className="flex items-center justify-center gap-1 text-[#1B4965] mb-1">
                <Users className="w-4 h-4" />
                <span className="font-bold text-sm">{capacity || "80-300"} pers.</span>
              </div>
              <span className="text-xs text-foreground/60">
                {language === "es" ? "Aforo / Capacidad" : "Capacity"}
              </span>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#1B4965] mb-1">
                  <Home className="w-4 h-4" />
                  <span className="font-bold text-sm">{bedrooms}</span>
                </div>
                <span className="text-xs text-foreground/60">
                  {language === "es" ? "Recámaras" : "Beds"}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#1B4965] mb-1">
                  <Bath className="w-4 h-4" />
                  <span className="font-bold text-sm">{bathrooms}</span>
                </div>
                <span className="text-xs text-foreground/60">
                  {language === "es" ? "Baños" : "Baths"}
                </span>
              </div>
            </>
          )}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[#1B4965] mb-1">
              <Maximize2 className="w-4 h-4" />
              <span className="font-bold text-sm">{area}</span>
            </div>
            <span className="text-xs text-foreground/60">m²</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
          <button
            onClick={handleViewDetails}
            className="bg-[#1B4965] hover:bg-[#13374E] text-white py-2 md:py-2.5 rounded-lg font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
          >
            <Eye className="w-4 h-4" />
            {language === "es" ? "Ver propiedad" : "View property"}
          </button>
          <a
            href={getWhatsAppUrl(
              buildWhatsAppContextMessage({
                title,
                city: location,
                price: formatPrice(price),
              })
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-2 md:py-2 rounded-lg font-semibold transition-all items-center justify-center gap-2 text-sm"
            title="Consultar por WhatsApp Business"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            {language === "es" ? "WhatsApp" : "WhatsApp"}
          </a>
        </div>
      </div>
    </div>
  );
};
