import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Sliders } from "lucide-react";
import { Product } from "@shared/api";

interface Property {
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

const properties: Property[] = [
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
  {
    id: "7",
    title: "Casita Cozy Oaxaca",
    price: 85000,
    location: "Oaxaca, OAX",
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    description:
      "Acogedora casa en el centro histórico, perfecta para inversor.",
    type: "casa",
    state: "Oaxaca",
  },
  {
    id: "8",
    title: "Quinta Turística Veracruz",
    price: 320000,
    location: "Veracruz, VER",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    description:
      "Propiedad con potencial turístico, entre naturaleza y comodidades.",
    type: "casa",
    state: "Veracruz",
  },
];

export default function Casas() {
  const { language } = useLanguage();
  const t = translations[language];
  const [filterType, setFilterType] = useState<"all" | "casa" | "terreno">(
    "all",
  );
  const [filterState, setFilterState] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);
  const [loadedProperties, setLoadedProperties] = useState<Property[]>(properties);
  const [supabaseProperties, setSupabaseProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", currentPage.toString());
        params.append("limit", "20");
        if (filterType !== "all") {
          params.append("type", filterType);
        }

        const response = await fetch(`/api/products?${params}`);
        const result = await response.json();

        if (result.data) {
          const convertedProperties: Property[] = result.data.map((product: Product) => ({
            id: product.id,
            title: product.name,
            price: product.price,
            location: product.city,
            bedrooms: 0,
            bathrooms: 0,
            area: 0,
            description: product.description,
            type: product.type,
            state: product.city,
            image: product.image,
          }));

          setSupabaseProperties(convertedProperties);
          setTotalPages(result.pagination.totalPages);
        } else {
          const convertedProperties: Property[] = result.map((product: Product) => ({
            id: product.id,
            title: product.name,
            price: product.price,
            location: product.city,
            bedrooms: 0,
            bathrooms: 0,
            area: 0,
            description: product.description,
            type: product.type,
            state: product.city,
            image: product.image,
          }));

          setSupabaseProperties(convertedProperties);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setSupabaseProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filterType]);

  const allProperties = [...supabaseProperties, ...properties];
  const states = ["all", ...new Set(allProperties.map((p) => p.state))];

  const filteredProperties = allProperties.filter((property) => {
    const typeMatch = filterType === "all" || property.type === filterType;
    const stateMatch = filterState === "all" || property.state === filterState;
    const priceMatch =
      property.price >= priceRange[0] && property.price <= priceRange[1];
    return typeMatch && stateMatch && priceMatch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.casas.title}
            </h1>
            <p className="text-lg text-foreground/70">{t.casas.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-semibold mb-4"
              >
                <Sliders className="w-4 h-4" />
                {language === "es" ? "Filtros" : "Filters"}
              </button>

              <div
                className={`${
                  showFilters ? "block" : "hidden"
                } lg:block bg-white rounded-2xl p-6 border border-border h-fit sticky top-20`}
              >
                <h3 className="text-lg font-bold text-foreground mb-6">
                  {language === "es" ? "Filtrar por" : "Filter by"}
                </h3>

                {/* Type Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Tipo" : "Type"}
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={filterType === "all"}
                        onChange={() => setFilterType("all")}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground/70">
                        {language === "es" ? "Todas" : "All"}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={filterType === "casa"}
                        onChange={() => setFilterType("casa")}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground/70">
                        {language === "es" ? "Casas" : "Houses"}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={filterType === "terreno"}
                        onChange={() => setFilterType("terreno")}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground/70">
                        {language === "es" ? "Terrenos" : "Land"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* State Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Estado" : "State"}
                  </h4>
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">
                      {language === "es" ? "Todos" : "All"}
                    </option>
                    {states
                      .filter((s) => s !== "all")
                      .map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Precio" : "Price"}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-foreground/70">
                        {language === "es" ? "Mínimo" : "Min"}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([Number(e.target.value), priceRange[1]])
                        }
                        className="w-full"
                      />
                      <p className="text-sm font-semibold text-primary mt-1">
                        {formatPrice(priceRange[0])}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-foreground/70">
                        {language === "es" ? "Máximo" : "Max"}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value)])
                        }
                        className="w-full"
                      />
                      <p className="text-sm font-semibold text-primary mt-1">
                        {formatPrice(priceRange[1])}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setFilterType("all");
                    setFilterState("all");
                    setPriceRange([0, 500000]);
                  }}
                  className="w-full border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                >
                  {language === "es" ? "Limpiar filtros" : "Clear filters"}
                </button>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  {language === "es"
                    ? `${filteredProperties.length} Propiedades`
                    : `${filteredProperties.length} Properties`}
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <p className="text-lg text-foreground/70">
                    {language === "es" ? "Cargando propiedades..." : "Loading properties..."}
                  </p>
                </div>
              ) : filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-lg text-foreground/70 mb-4">
                    {language === "es"
                      ? "No hay propiedades que coincidan con tus filtros"
                      : "No properties match your filters"}
                  </p>
                  <button
                    onClick={() => {
                      setFilterType("all");
                      setFilterState("all");
                      setPriceRange([0, 500000]);
                    }}
                    className="text-primary font-semibold hover:underline"
                  >
                    {language === "es"
                      ? "Ver todas las propiedades"
                      : "View all properties"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
