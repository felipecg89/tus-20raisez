import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

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
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  type: "casa" | "terreno";
  state: string;
  image?: string;
}

// Local properties data
const localProperties: LocalProperty[] = [
  {
    id: "1",
    title: "Casa Colonial en Guanajuato",
    price: 180000,
    location: "Guanajuato, GTO",
    bedrooms: 3,
    bathrooms: 2,
    area: 250,
    description:
      "Hermosa casa colonial con patio interior, acabados de lujo y vista a la ciudad.",
    type: "casa",
    state: "Guanajuato",
  },
  {
    id: "2",
    title: "Departamento Playa Jalisco",
    price: 250000,
    location: "Puerto Vallarta, JAL",
    bedrooms: 2,
    bathrooms: 2,
    area: 150,
    description:
      "Moderno departamento con vista al mar, acceso a playa privada y amenidades.",
    type: "casa",
    state: "Jalisco",
  },
  {
    id: "3",
    title: "Terreno Desarrollo Nuevo",
    price: 120000,
    location: "Monterrey, NL",
    bedrooms: 0,
    bathrooms: 0,
    area: 1200,
    description:
      "Terreno en desarrollo inmobiliario con servicios incluidos e infraestructura lista.",
    type: "terreno",
    state: "Nuevo León",
  },
  {
    id: "4",
    title: "Casa Campestre Michoacán",
    price: 200000,
    location: "Morelia, MICH",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    description:
      "Casa campestre con grandes extensiones, alberca y jardín amplío.",
    type: "casa",
    state: "Michoacán",
  },
  {
    id: "5",
    title: "Penthouse Centro CDMX",
    price: 450000,
    location: "CDMX",
    bedrooms: 3,
    bathrooms: 3,
    area: 280,
    description:
      "Elegante penthouse en zona exclusiva con terraza panorámica y seguridad 24/7.",
    type: "casa",
    state: "Ciudad de México",
  },
  {
    id: "6",
    title: "Lote Residencial Querétaro",
    price: 95000,
    location: "Querétaro, QRO",
    bedrooms: 0,
    bathrooms: 0,
    area: 800,
    description:
      "Lote residencial en fraccionamiento consolidado, todos los servicios disponibles.",
    type: "terreno",
    state: "Querétaro",
  },
];

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const [property, setProperty] = useState<Product | LocalProperty | null>(null);
  const [media, setMedia] = useState<PropertyMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLocalProperty, setIsLocalProperty] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);

        // First, check if it's a local property
        const localProp = localProperties.find((p) => p.id === id);
        if (localProp) {
          setProperty(localProp);
          setIsLocalProperty(true);
          return;
        }

        // Otherwise, try Supabase
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          navigate("/casas");
          return;
        }
        const data = await response.json();
        setProperty(data);
        setIsLocalProperty(false);

        // Fetch media from Supabase only
        try {
          const mediaResponse = await fetch(`/api/products/${id}/media`);
          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json();
            setMedia(mediaData);
          }
        } catch (error) {
          console.error("Error fetching media:", error);
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
        <Footer />
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
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
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

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola, me interesa la propiedad: ${getPropertyName()} en ${getPropertyCity()}`
    );
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
  };

  const images = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");
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
            <div className="lg:col-span-2 space-y-4">
              {/* Main Image */}
              {mainImage && (
                <div className="relative w-full h-96 md:h-[500px] bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={mainImage}
                    alt={property.name}
                    className="w-full h-full object-cover"
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
                </div>
              )}

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
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

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
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Info Section */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {property.name}
                </h1>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(property.price)}
                </p>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">{property.city}</p>
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

              {/* Features */}
              {property.features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Características" : "Features"}
                  </h3>
                  <div className="space-y-2">
                    {property.features.map((feature, idx) => (
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

              {/* Contact Button */}
              <button
                onClick={handleWhatsApp}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                {language === "es" ? "Contactar por WhatsApp" : "Contact on WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
