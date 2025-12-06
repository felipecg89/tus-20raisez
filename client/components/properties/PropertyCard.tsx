import { MapPin, Home, Bath, Maximize2, MessageCircle } from "lucide-react";
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
  const { language } = useLanguage();
  const t = translations[language];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola, me interesa la propiedad: ${title} en ${location}`,
    );
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
          {type === "casa" ? "🏡" : "🏞️"}
        </div>
        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg font-bold">
          {formatPrice(price)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-foreground/70 mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Description */}
        <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Home className="w-4 h-4" />
              <span className="font-bold">{bedrooms}</span>
            </div>
            <span className="text-xs text-foreground/60">
              {language === "es" ? "Recámaras" : "Bedrooms"}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Bath className="w-4 h-4" />
              <span className="font-bold">{bathrooms}</span>
            </div>
            <span className="text-xs text-foreground/60">
              {language === "es" ? "Baños" : "Bathrooms"}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Maximize2 className="w-4 h-4" />
              <span className="font-bold">{area}</span>
            </div>
            <span className="text-xs text-foreground/60">m²</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleWhatsApp}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          {language === "es" ? "Consultar" : "Inquire"}
        </button>
      </div>
    </div>
  );
};
