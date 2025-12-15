import { MapPin, Home, Bath, Maximize2, MessageCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  image: string;
  type: string;
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
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleViewDetails = () => {
    navigate(`/casas/${id}`);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola, me interesa la propiedad: ${title} en ${location}`,
    );
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
  };

  return (
    <div className="bg-white border border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group md:rounded-2xl">
      {/* Image - Full Width on Mobile */}
      <div className="relative h-56 md:h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl group-hover:scale-105 transition-transform duration-300">
            {type === "casa" ? "🏡" : "🏞️"}
          </div>
        )}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-primary text-white px-3 py-1 md:px-4 md:py-2 rounded-lg font-bold text-sm md:text-base">
          {formatPrice(price)}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-6">
        {/* Title - Prominent on Mobile */}
        <h3 className="text-sm md:text-xl font-bold text-foreground mb-3 md:mb-4 line-clamp-2">
          {title}
        </h3>

        {/* Location - Hidden on Mobile, Visible on Desktop */}
        <div className="hidden md:flex items-center gap-2 text-foreground/70 mb-3 md:mb-4">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-sm font-semibold">{location}</span>
        </div>

        {/* Description - Hidden on Mobile */}
        <p className="hidden md:block text-foreground/70 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Features - Hidden on Mobile */}
        {(bedrooms > 0 || bathrooms > 0 || area > 0) && (
          <div className="hidden md:grid grid-cols-3 gap-3 py-3 md:py-4 border-y border-border mb-4">
            {bedrooms > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Home className="w-4 h-4" />
                  <span className="font-bold text-sm">{bedrooms}</span>
                </div>
                <span className="text-xs text-foreground/60">
                  {language === "es" ? "Recámaras" : "Beds"}
                </span>
              </div>
            )}
            {bathrooms > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Bath className="w-4 h-4" />
                  <span className="font-bold text-sm">{bathrooms}</span>
                </div>
                <span className="text-xs text-foreground/60">
                  {language === "es" ? "Baños" : "Baths"}
                </span>
              </div>
            )}
            {area > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Maximize2 className="w-4 h-4" />
                  <span className="font-bold text-sm">{area}</span>
                </div>
                <span className="text-xs text-foreground/60">m²</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons - Only Ver on Mobile */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
          <button
            onClick={handleViewDetails}
            className="bg-gradient-turquoise-sky text-white py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs md:text-base"
          >
            <Eye className="w-4 h-4" />
            {language === "es" ? "Ver" : "View"}
          </button>
          <button
            onClick={handleWhatsApp}
            className="hidden md:flex border-2 border-primary text-primary py-2 md:py-2 rounded-lg font-semibold hover:bg-primary/5 transition-all items-center justify-center gap-2 text-sm md:text-base"
          >
            <MessageCircle className="w-4 h-4" />
            {language === "es" ? "Consultar" : "Inquire"}
          </button>
        </div>
      </div>
    </div>
  );
};
