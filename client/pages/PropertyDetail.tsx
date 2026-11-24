import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Product } from "@shared/api";
import {
  MapPin,
  Home,
  Bath,
  Maximize2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { PropertyCard } from "@/components/properties/PropertyCard";
import {
  CALL_US_DISPLAY,
  CALL_MX_DISPLAY,
  getWhatsAppUrl,
  getCallUrl,
  buildWhatsAppContextMessage,
} from "@/config/contact";

interface PropertyMedia {
  type: "image" | "video";
  url: string;
  path: string;
}

interface LocalProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  type: "casa" | "terreno" | "departamento" | "comercio" | "salon_fiestas";
  state: string;
  image?: string;
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const [property, setProperty] = useState<Product | LocalProperty | null>(null);
  const [relatedList, setRelatedList] = useState<LocalProperty[]>([]);
  const [media, setMedia] = useState<PropertyMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLocalProperty, setIsLocalProperty] = useState(false);
  const { exchangeRate } = useExchangeRate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          navigate("/casas");
          return;
        }
        const data = await response.json();
        setProperty(data);
        setIsLocalProperty(false);

        try {
          const mediaResponse = await fetch(`/api/products/${id}/media`);
          if (mediaResponse.ok) {
            const mediaJson = await mediaResponse.json();
            const rawItems = Array.isArray(mediaJson?.data)
              ? mediaJson.data
              : Array.isArray(mediaJson)
                ? mediaJson
                : [];
            setMedia(
              rawItems.map((m: any) => ({
                type: m.media_type || m.type || "image",
                url: m.media_url || m.url || "",
                path: m.storage_path || m.path || "",
              }))
            );
          }
        } catch (error) {
          console.error("Error fetching media:", error);
        }

        try {
          const relatedResp = await fetch("/api/products?limit=8");
          if (relatedResp.ok) {
            const relatedJson = await relatedResp.json();
            const items: Product[] = Array.isArray(relatedJson?.data)
              ? relatedJson.data
              : Array.isArray(relatedJson)
                ? relatedJson
                : [];
            setRelatedList(
              items
                .filter((p) => String(p.id) !== String(id))
                .slice(0, 4)
                .map((p) => ({
                  id: String(p.id),
                  title: p.name,
                  price: p.price,
                  location: p.city ? `${p.city}${p.state ? `, ${p.state}` : ""}` : p.state || "México",
                  bedrooms: p.bedrooms || 0,
                  bathrooms: p.bathrooms || 0,
                  area: p.area || 0,
                  description: p.description || "",
                  type: (p.type as LocalProperty["type"]) || "casa",
                  state: p.state || p.city || "",
                  image: p.image,
                }))
            );
          }
        } catch {
          setRelatedList([]);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        navigate("/casas");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1 py-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-foreground/70">
              {language === "es" ? "Cargando..." : "Loading..."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1 py-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-foreground/70">
              {language === "es" ? "Propiedad no encontrada" : "Property not found"}
            </p>
          </div>
        </main>
      </div>
    );
  }

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

  const getPropertyName = () => {
    if ("name" in property) return property.name;
    return property.title;
  };

  const getPropertyCity = () => {
    if ("city" in property) return property.city;
    return property.location;
  };

  const getPropertyImage = () => {
    if ("image" in property) return property.image;
    return undefined;
  };

  const getPropertyFeatures = () => {
    if ("features" in property) return property.features;
    return [];
  };

  const getRelatedProperties = () => {
    return relatedList;
  };

  const handleWhatsApp = () => {
    const text =
      language === "es"
        ? `Hola, vivo en EE.UU. y me interesa la propiedad "${getPropertyName()}" en ${getPropertyCity()} (ID: ${id}). ¿Podrían darme más información sobre los trámites de compra y escrituración desde Estados Unidos?`
        : `Hello, I live in the US and I'm interested in "${getPropertyName()}" in ${getPropertyCity()} (ID: ${id}). Could you provide more details about purchasing and legal procedures from the US?`;
    window.open(getWhatsAppUrl(text), "_blank");
  };

  const mediaArray = Array.isArray(media) ? media : [];
  const images = mediaArray.filter((m) => m.type === "image");
  const videos = mediaArray.filter((m) => m.type === "video");
  const mainImage = selectedImage || getPropertyImage() || images[0]?.url;

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate("/casas")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            {language === "es" ? "Volver a Casas" : "Back to Properties"}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gallery Section */}
            <div className="lg:col-span-2">
              <div className="space-y-3">
                {/* Main Image */}
                {mainImage && (
                  <div className="relative w-full h-96 md:h-[500px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center group">
                    <img
                      src={mainImage}
                      alt={getPropertyName()}
                      className="w-full h-full object-contain"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={goToPreviousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={goToNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}

                    {/* Google Maps Button - Bottom Right */}
                    {("latitude" in property && property.latitude && "longitude" in property && property.longitude) && (
                      <a
                        href={`https://www.google.com/maps/?q=${property.latitude},${property.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-red-500" />
                        {language === "es" ? "Ver en Google Maps" : "View on Google Maps"}
                      </a>
                    )}
                  </div>
                )}

                {/* Info Bar Below Image */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground">
                        {getPropertyName()}
                      </h3>
                      <div className="flex items-center gap-2 text-foreground/70 mt-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm">{getPropertyCity()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Area */}
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">
                        {language === "es" ? "Área" : "Area"}
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        {property.area} m²
                      </p>
                    </div>

                    {/* Bedrooms */}
                    {property.bedrooms > 0 && (
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-foreground/60 mb-1">
                          {language === "es" ? "Recámaras" : "Bedrooms"}
                        </p>
                        <p className="font-semibold text-foreground text-sm flex items-center gap-1">
                          <Home className="w-3 h-3 text-primary" />
                          {property.bedrooms}
                        </p>
                      </div>
                    )}

                    {/* Bathrooms */}
                    {property.bathrooms > 0 && (
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-foreground/60 mb-1">
                          {language === "es" ? "Baños" : "Bathrooms"}
                        </p>
                        <p className="font-semibold text-foreground text-sm flex items-center gap-1">
                          <Bath className="w-3 h-3 text-primary" />
                          {property.bathrooms}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImage(img.url);
                          setCurrentImageIndex(idx);
                        }}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === img.url || currentImageIndex === idx
                            ? "border-primary"
                            : "border-gray-300 hover:border-primary"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt="Thumbnail"
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos Section */}
              {videos.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {language === "es" ? "Videos" : "Videos"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {videos.map((video, idx) => (
                      <div
                        key={idx}
                        className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden"
                      >
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Info Section */}
            <div className="lg:col-span-1 space-y-6">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">{getPropertyCity()}</p>
                  <p className="text-sm text-foreground/70">
                    {property.type === "casa"
                      ? language === "es"
                        ? "Casa"
                        : "House"
                      : language === "es"
                        ? "Terreno"
                        : "Land"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {language === "es" ? "Descripción" : "Description"}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  {language === "es" ? "Especificaciones" : "Specifications"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Area */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-foreground/60 mb-1">
                      {language === "es" ? "Área" : "Area"}
                    </p>
                    <p className="font-semibold text-foreground">
                      {property.area} m²
                    </p>
                  </div>

                  {/* Property Type */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-foreground/60 mb-1">
                      {language === "es" ? "Tipo" : "Type"}
                    </p>
                    <p className="font-semibold text-foreground">
                      {property.type === "casa"
                        ? language === "es"
                          ? "Casa"
                          : "House"
                        : language === "es"
                          ? "Terreno"
                          : "Land"}
                    </p>
                  </div>

                  {/* Bedrooms */}
                  {property.bedrooms > 0 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">
                        {language === "es" ? "Recámaras" : "Bedrooms"}
                      </p>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Home className="w-4 h-4 text-primary" />
                        {property.bedrooms}
                      </p>
                    </div>
                  )}

                  {/* Bathrooms */}
                  {property.bathrooms > 0 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">
                        {language === "es" ? "Baños" : "Bathrooms"}
                      </p>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Bath className="w-4 h-4 text-primary" />
                        {property.bathrooms}
                      </p>
                    </div>
                  )}

                  {/* State */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-foreground/60 mb-1">
                      {language === "es" ? "Estado" : "State"}
                    </p>
                    <p className="font-semibold text-foreground">
                      {property.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              {getPropertyFeatures().length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Características" : "Features"}
                  </h3>
                  <div className="space-y-2">
                    {getPropertyFeatures().map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-foreground/70"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={getWhatsAppUrl(
                    buildWhatsAppContextMessage({
                      title: getPropertyName(),
                      city: getPropertyCity(),
                      price: formatPrice(property.price),
                    })
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base shadow-sm"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  {language === "es" ? "Contactar por WhatsApp Business" : "Chat on WhatsApp Business"}
                </a>

                {/* Toll-Free Calls to Zadarma */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                    {language === "es" ? "📞 O llámanos 100% gratis:" : "📞 Or Call Toll-Free:"}
                  </p>
                  <a
                    href={getCallUrl("us")}
                    className="w-full bg-[#1B4965] hover:bg-[#13374E] text-white py-2.5 px-3 rounded-xl font-bold flex items-center justify-between text-xs sm:text-sm shadow-sm transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>🇺🇸 {CALL_US_DISPLAY}</span>
                    </span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                      USA Sin Costo
                    </span>
                  </a>
                  <a
                    href={getCallUrl("mx")}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-[#1B4965] py-2.5 px-3 rounded-xl font-bold flex items-center justify-between text-xs sm:text-sm transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>🇲🇽 {CALL_MX_DISPLAY}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                      Lada 800 México
                    </span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {getRelatedProperties().length > 0 && (
          <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {language === "es" ? "También te puede interesar" : "You might also like"}
              </h2>
              <p className="text-foreground/60 mb-8">
                {language === "es"
                  ? "Propiedades similares a la que consultaste"
                  : "Similar properties to the one you viewed"}
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {getRelatedProperties().map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    id={prop.id}
                    title={prop.title}
                    price={prop.price}
                    location={prop.location}
                    bedrooms={prop.bedrooms}
                    bathrooms={prop.bathrooms}
                    area={prop.area}
                    description={prop.description}
                    image={prop.image || ""}
                    type={prop.type}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
