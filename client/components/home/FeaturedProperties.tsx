import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Building2 } from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@shared/api";

interface FeaturedItem {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  type: "casa" | "departamento" | "terreno" | "comercio" | "salon_fiestas";
  image: string;
}

export const FeaturedProperties = () => {
  const { language } = useLanguage();
  const [properties, setProperties] = useState<FeaturedItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch("/api/products?limit=3");
        const contentType = response.headers.get("content-type") || "";
        if (response.ok && contentType.includes("application/json")) {
          const result = await response.json();
          const items = Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
              ? result
              : [];
          setProperties(
            items.slice(0, 3).map((p: Product) => ({
              id: String(p.id),
              title: p.name,
              price: p.price,
              location: p.city ? `${p.city}${p.state ? `, ${p.state}` : ""}` : p.state || "México",
              bedrooms: p.bedrooms || 0,
              bathrooms: p.bathrooms || 0,
              area: p.area || 0,
              description: p.description || "",
              type: (p.type as FeaturedItem["type"]) || "casa",
              image: p.image || "/images/casa-mexico-fachada.jpg",
            }))
          );
        }
      } catch {
        setProperties([]);
      } finally {
        setLoaded(true);
      }
    };
    fetchFeatured();
  }, []);

  if (!loaded || properties.length === 0) {
    return null;
  }

  return (
    <section className="py-14 md:py-20 bg-white border-b border-[#DFE5EA]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-[#1B4965] uppercase tracking-wider bg-[#1B4965]/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
              {language === "es" ? "Propiedades Destacadas" : "Featured Properties"}
            </div>
            <h2 className="font-heading font-extrabold text-2xl md:text-4xl text-[#101B24] tracking-tight">
              {language === "es"
                ? "Inmuebles verificados listos para comprar desde EE. UU."
                : "Verified properties ready to buy from the US"}
            </h2>
            <p className="text-sm md:text-base text-[#465664]">
              {language === "es"
                ? "Conoce algunas de las oportunidades seleccionadas con certeza jurídica y opciones de financiamiento."
                : "Explore selected opportunities with guaranteed legal certainty and financing options."}
            </p>
          </div>
          <Link
            to="/casas"
            className="inline-flex items-center gap-2 self-start md:self-auto bg-[#1B4965] hover:bg-[#13374E] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <span>{language === "es" ? "Ver todo el catálogo" : "View all catalog"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
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
              image={prop.image}
              type={prop.type}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/casas"
            className="inline-flex items-center justify-center gap-2 text-[#1B4965] font-bold text-sm hover:underline"
          >
            <Building2 className="w-4 h-4" />
            {language === "es"
              ? "Ver todas las propiedades disponibles en el catálogo →"
              : "View all available properties in catalog →"}
          </Link>
        </div>
      </div>
    </section>
  );
};
