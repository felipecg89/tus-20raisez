import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Sliders, X } from "lucide-react";
import { Product } from "@shared/api";
import { useExchangeRate } from "@/hooks/useExchangeRate";

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
      "Hermosa casa colonial con patio interior, acabados de cedro, cantera y vista a la ciudad histórica.",
    type: "casa",
    state: "Guanajuato",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "2",
    title: "Departamento Vista al Mar Jalisco",
    price: 250000,
    location: "Puerto Vallarta, JAL",
    bedrooms: 2,
    bathrooms: 2,
    area: 150,
    description:
      "Moderno departamento con vista a la bahía, acceso a playa privada y amenidades de lujo.",
    type: "casa",
    state: "Jalisco",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "3",
    title: "Residencia Contemporánea Monterrey",
    price: 320000,
    location: "Monterrey, NL",
    bedrooms: 4,
    bathrooms: 4,
    area: 380,
    description:
      "Espectacular casa contemporánea en fraccionamiento privado con vigilancia y amplio jardín.",
    type: "casa",
    state: "Nuevo León",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "4",
    title: "Lote Residencial Querétaro",
    price: 95000,
    location: "Querétaro, QRO",
    bedrooms: 0,
    bathrooms: 0,
    area: 800,
    description:
      "Lote residencial en fraccionamiento consolidado, todos los servicios subterráneos disponibles.",
    type: "terreno",
    state: "Querétaro",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "5",
    title: "Casa Campestre Morelia",
    price: 200000,
    location: "Morelia, MICH",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    description:
      "Casa campestre con grandes extensiones de jardín, alberca privada y chimenea rústica.",
    type: "casa",
    state: "Michoacán",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "6",
    title: "Penthouse de Lujo CDMX",
    price: 450000,
    location: "CDMX",
    bedrooms: 3,
    bathrooms: 3,
    area: 280,
    description:
      "Elegante penthouse en zona exclusiva con terraza panorámica, roof garden y seguridad 24/7.",
    type: "casa",
    state: "Ciudad de México",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "7",
    title: "Casa Yucateca con Alberca Mérida",
    price: 165000,
    location: "Mérida, YUC",
    bedrooms: 3,
    bathrooms: 2,
    area: 210,
    description:
      "Acogedora casa tradicional en el centro de Mérida con alberca chukum y patio colonial.",
    type: "casa",
    state: "Yucatán",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "8",
    title: "Quinta Colonial Zacatecas",
    price: 215000,
    location: "Zacatecas, ZAC",
    bedrooms: 4,
    bathrooms: 3,
    area: 310,
    description:
      "Propiedad colonial con acabados en cantera rosa, portón de hierro y amplia cochera.",
    type: "casa",
    state: "Zacatecas",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function Casas() {
  const { language } = useLanguage();
  const t = translations[language];
  const { exchangeRate } = useExchangeRate();
  const [filterType, setFilterType] = useState<"all" | "casa" | "terreno">(
    "all",
  );
  const [filterState, setFilterState] = useState("all");
  const [filterCategory, setFilterCategory] = useState<"all" | "compra" | "renta">("all");
  const [filterCommercial, setFilterCommercial] = useState<"all" | "commercial" | "residential">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);
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
        if (!response.ok) {
          // If server error, fallback safely without throwing uncaught errors
          setSupabaseProperties([]);
          return;
        }

        const result = await response.json();

        if (result && Array.isArray(result.data)) {
          const convertedProperties: Property[] = result.data.map((product: Product) => ({
            id: String(product.id),
            title: product.name,
            price: product.price,
            location: product.city ? `${product.city}, ${product.state || ""}` : product.state || "México",
            bedrooms: product.bedrooms || 0,
            bathrooms: product.bathrooms || 0,
            area: product.area || 0,
            description: product.description,
            type: product.type as "casa" | "terreno",
            state: product.state || product.city || "",
            image: product.image,
          }));

          setSupabaseProperties(convertedProperties);
          if (result.pagination?.totalPages) {
            setTotalPages(result.pagination.totalPages);
          }
        } else if (Array.isArray(result)) {
          const convertedProperties: Property[] = result.map((product: Product) => ({
            id: String(product.id),
            title: product.name,
            price: product.price,
            location: product.city ? `${product.city}, ${product.state || ""}` : product.state || "México",
            bedrooms: product.bedrooms || 0,
            bathrooms: product.bathrooms || 0,
            area: product.area || 0,
            description: product.description,
            type: product.type as "casa" | "terreno",
            state: product.state || product.city || "",
            image: product.image,
          }));

          setSupabaseProperties(convertedProperties);
        } else {
          setSupabaseProperties([]);
        }
      } catch (error) {
        console.warn("Unable to fetch live products, using verified catalog:", error);
        setSupabaseProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filterType]);

  const allProperties = supabaseProperties.length > 0 ? supabaseProperties : properties;
  const states = ["all", ...new Set(allProperties.map((p) => p.state))];

  const filteredProperties = allProperties.filter((property) => {
    const typeMatch = filterType === "all" || property.type === filterType;
    const stateMatch = filterState === "all" || property.state === filterState;
    const priceMatch =
      property.price >= priceRange[0] && property.price <= priceRange[1];
    const categoryMatch = filterCategory === "all" || (property as any).category === filterCategory;
    const commercialMatch = filterCommercial === "all" ||
      (filterCommercial === "commercial" ? (property as any).isCommercial : !(property as any).isCommercial);
    return typeMatch && stateMatch && priceMatch && categoryMatch && commercialMatch;
  });

  const formatPrice = (price: number) => {
    if (language === "es") {
      const priceInMXN = price * exchangeRate;
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }).format(priceInMXN);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(price);
    }
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
            <div className="relative lg:col-span-1">
              <div
                className={`fixed lg:static left-0 top-0 h-screen lg:h-auto w-80 lg:w-full bg-white lg:rounded-2xl border-r lg:border-r-0 lg:border border-border overflow-y-auto lg:overflow-visible z-50 lg:z-auto transition-transform duration-300 ease-in-out lg:transition-none ${
                  showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                } lg:sticky lg:top-20`}
              >
                <div className="flex items-center justify-between p-6 border-b border-border lg:sticky lg:top-0 lg:bg-white lg:z-10">
                  <h3 className="text-lg font-bold text-foreground">
                    {language === "es" ? "Filtrar por" : "Filter by"}
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-1 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                <div className="p-6">

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

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Categoría" : "Category"}
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filterCategory === "all"}
                        onChange={() => setFilterCategory("all")}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground/70">
                        {language === "es" ? "Todas" : "All"}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filterCategory === "compra"}
                        onChange={() => setFilterCategory("compra")}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground/70">
                        {language === "es" ? "Compra" : "Purchase"}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filterCategory === "renta"}
                        onChange={() => setFilterCategory("renta")}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground/70">
                        {language === "es" ? "Renta" : "Rental"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Commercial Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {language === "es" ? "Tipo de Propiedad" : "Property Type"}
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commercial"
                        checked={filterCommercial === "all"}
                        onChange={() => setFilterCommercial("all")}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground/70">
                        {language === "es" ? "Todas" : "All"}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commercial"
                        checked={filterCommercial === "residential"}
                        onChange={() => setFilterCommercial("residential")}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground/70">
                        {language === "es" ? "No Comercial" : "Residential"}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commercial"
                        checked={filterCommercial === "commercial"}
                        onChange={() => setFilterCommercial("commercial")}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground/70">
                        {language === "es" ? "Comercial" : "Commercial"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setFilterType("all");
                    setFilterState("all");
                    setFilterCategory("all");
                    setFilterCommercial("all");
                    setPriceRange([0, 500000]);
                  }}
                  className="w-full border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary/5 transition-colors mb-6"
                >
                  {language === "es" ? "Limpiar filtros" : "Clear filters"}
                </button>
                </div>
              </div>
            </div>

            {/* Overlay for mobile */}
            {showFilters && (
              <div
                className="fixed inset-0 bg-black/50 lg:hidden z-40"
                onClick={() => setShowFilters(false)}
              />
            )}

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              {/* Filters Button - Mobile Only */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-primary/90 transition-all"
              >
                <Sliders className="w-4 h-4" />
                {language === "es" ? "Filtros" : "Filters"}
              </button>

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
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8 mb-8">
                    {filteredProperties.map((property) => (
                      <PropertyCard key={property.id} {...property} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {language === "es" ? "Anterior" : "Previous"}
                      </button>
                      <span className="text-foreground font-medium">
                        {language === "es" ? "Página" : "Page"} {currentPage} {language === "es" ? "de" : "of"} {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {language === "es" ? "Siguiente" : "Next"}
                      </button>
                    </div>
                  )}
                </>
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
                      setCurrentPage(1);
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
    </div>
  );
}
