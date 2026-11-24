import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Sliders } from "lucide-react";
import { Product } from "@shared/api";
import { useExchangeRate } from "@/hooks/useExchangeRate";

interface RentalProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  type: "casa" | "terreno" | "departamento" | "oficina" | "comercio" | "salon_fiestas";
  state: string;
  category?: string;
  isCommercial?: boolean;
  rentalPrice?: number;
  rentalPeriod?: "monthly" | "yearly" | "evento" | "dia" | "anual" | string;
  capacity?: number;
  image?: string;
}

export default function Rentals() {
  const { language } = useLanguage();
  const t = translations[language];
  const { exchangeRate } = useExchangeRate();
  const [searchParams] = useSearchParams();

  const [rentalProperties, setRentalProperties] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | string>(searchParams.get("type") || "all");
  const [filterState, setFilterState] = useState(searchParams.get("state") || "all");
  const [filterCategory, setFilterCategory] = useState<"all" | "compra" | "renta">("all");
  const [filterCommercial, setFilterCommercial] = useState<"all" | "commercial" | "residential">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) setFilterType(typeParam);
    const stateParam = searchParams.get("state");
    if (stateParam) setFilterState(stateParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products?category=renta&limit=50");
        const contentType = response.headers.get("content-type") || "";
        if (response.ok && contentType.includes("application/json")) {
          const result = await response.json();
          const list: Product[] = Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
              ? result
              : [];
          setRentalProperties(
            list.map((p) => ({
              id: String(p.id),
              title: p.name,
              price: Number(p.price || 0),
              rentalPrice: Number(p.price || 0),
              rentalPeriod: p.rentalPeriod || "mensual",
              capacity: p.capacity,
              location: p.city ? `${p.city}${p.state ? `, ${p.state}` : ""}` : p.state || "México",
              bedrooms: p.bedrooms || 0,
              bathrooms: p.bathrooms || 0,
              area: p.area || 0,
              description: p.description || "",
              type: (p.type as RentalProperty["type"]) || "casa",
              state: p.state || p.city || "",
              category: p.category,
              isCommercial: p.isCommercial,
              image: p.image,
            }))
          );
        } else {
          setRentalProperties([]);
        }
      } catch {
        setRentalProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const states = ["all", ...new Set(rentalProperties.map((p) => p.state).filter(Boolean))];

  const filteredProperties = rentalProperties.filter((property) => {
    const typeMatch = filterType === "all" || property.type === filterType;
    const stateMatch = filterState === "all" || property.state === filterState;
    const priceMatch =
      property.price >= priceRange[0] &&
      (priceRange[1] >= 5000 ? true : property.price <= priceRange[1]);
    const categoryMatch = filterCategory === "all" || property.category === filterCategory;
    const commercialMatch =
      filterCommercial === "all" ||
      (filterCommercial === "commercial" ? property.isCommercial : !property.isCommercial);
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
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              {language === "es"
                ? "Alquila tu Casa o Terreno"
                : "Rent Your Property"}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-foreground/70">
              {language === "es"
                ? "Propiedades disponibles para alquiler a paisanos en Estados Unidos. Gana dinero pasivo mientras viajas."
                : "Properties available for rent to paisanos in the United States. Earn passive income while you travel."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div
                className={`${
                  showFilters ? "block" : "hidden"
                } lg:block bg-muted rounded-lg p-6 space-y-6`}
              >
                <div>
                  <h3 className="font-bold text-foreground mb-4">
                    {language === "es" ? "Filtrar por" : "Filter by"}
                  </h3>

                  {/* Type Filter */}
                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-semibold text-foreground">
                      {language === "es" ? "Tipo" : "Type"}
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "all", label: language === "es" ? "Todos" : "All" },
                        {
                          value: "casa",
                          label: language === "es" ? "Casas" : "Houses",
                        },
                        {
                          value: "departamento",
                          label:
                            language === "es" ? "Departamentos" : "Apartments",
                        },
                        {
                          value: "oficina",
                          label: language === "es" ? "Oficinas" : "Offices",
                        },
                        {
                          value: "terreno",
                          label: language === "es" ? "Terrenos" : "Land",
                        },
                        {
                          value: "comercio",
                          label: language === "es" ? "Comercios / Locales" : "Commercial",
                        },
                        {
                          value: "salon_fiestas",
                          label: language === "es" ? "Salones de Fiestas y Eventos" : "Event Halls",
                        },
                      ].map((type) => (
                        <label key={type.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="type"
                            value={type.value}
                            checked={filterType === type.value}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-foreground/70">
                            {type.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* State Filter */}
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      {language === "es" ? "Estado" : "State"}
                    </label>
                    <select
                      value={filterState}
                      onChange={(e) => setFilterState(e.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2"
                    >
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state === "all"
                            ? language === "es"
                              ? "Todos"
                              : "All"
                            : state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground">
                      {language === "es" ? "Precio Mensual USD" : "Monthly Price USD"}
                    </label>
                    <div>
                      <label className="text-sm text-foreground/70">
                        {language === "es" ? "Mínimo" : "Min"}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
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
                        max="5000"
                        step="100"
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
                    setPriceRange([0, 5000]);
                  }}
                  className="w-full border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                >
                  {language === "es" ? "Limpiar filtros" : "Clear filters"}
                </button>
              </div>
            </div>

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

              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      price={property.price}
                      location={property.location}
                      bedrooms={property.bedrooms}
                      bathrooms={property.bathrooms}
                      area={property.area}
                      description={property.description}
                      image={property.image || ""}
                      type={property.type}
                      capacity={property.capacity}
                      rentalPeriod={property.rentalPeriod}
                    />
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
                      setFilterCategory("all");
                      setFilterCommercial("all");
                      setPriceRange([0, 5000]);
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
