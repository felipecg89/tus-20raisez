import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Search, X, RotateCcw, Building2, Home, Trees, Store, PartyPopper } from "lucide-react";
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
  type: "casa" | "departamento" | "terreno" | "comercio" | "salon_fiestas";
  state: string;
  image?: string;
  category?: string;
  capacity?: number;
  rentalPeriod?: string;
}

export default function Casas() {
  const { language } = useLanguage();
  const t = translations[language];
  const { exchangeRate } = useExchangeRate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados sincronizados con URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filterType, setFilterType] = useState<string>(searchParams.get("type") || "all");
  const [filterState, setFilterState] = useState(searchParams.get("state") || "all");
  const [filterCategory, setFilterCategory] = useState<string>(
    searchParams.get("operation") || searchParams.get("category") || "all"
  );
  const [pricePreset, setPricePreset] = useState<"all" | "under100k" | "100k-200k" | "over200k">("all");
  
  const [supabaseProperties, setSupabaseProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sincronizar cambios de query params cuando la URL cambie
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) setFilterType(typeParam);

    const stateParam = searchParams.get("state");
    if (stateParam) setFilterState(stateParam);

    const operationParam = searchParams.get("operation") || searchParams.get("category");
    if (operationParam) setFilterCategory(operationParam);

    const qParam = searchParams.get("q");
    if (qParam !== null) setSearchQuery(qParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", currentPage.toString());
        params.append("limit", "50");
        if (filterType !== "all") {
          params.append("type", filterType);
        }

        const response = await fetch(`/api/products?${params}`);
        const contentType = response.headers.get("content-type") || "";
        if (!response.ok || !contentType.includes("application/json")) {
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
            type: product.type as any,
            category: product.category,
            capacity: product.capacity,
            rentalPeriod: product.rentalPeriod,
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
            type: product.type as any,
            category: product.category,
            capacity: product.capacity,
            rentalPeriod: product.rentalPeriod,
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

  const allProperties = supabaseProperties;
  const states = useMemo(() => ["all", ...new Set(allProperties.map((p) => p.state).filter(Boolean))], [allProperties]);

  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      // 1. Filtro de búsqueda por texto libre
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesText =
          property.title.toLowerCase().includes(q) ||
          property.description.toLowerCase().includes(q) ||
          property.location.toLowerCase().includes(q) ||
          property.state.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      // 2. Filtro de tipo de propiedad
      if (filterType !== "all" && property.type !== filterType) {
        return false;
      }

      // 3. Filtro de estado
      if (filterState !== "all" && property.state !== filterState) {
        return false;
      }

      // 4. Filtro de categoría (compra / renta)
      if (filterCategory !== "all" && (property as any).category && (property as any).category !== filterCategory) {
        return false;
      }

      // 5. Presets de precio en USD
      if (pricePreset === "under100k" && property.price >= 100000) return false;
      if (pricePreset === "100k-200k" && (property.price < 100000 || property.price > 200000)) return false;
      if (pricePreset === "over200k" && property.price <= 200000) return false;

      return true;
    });
  }, [allProperties, searchQuery, filterType, filterState, filterCategory, pricePreset]);

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterState("all");
    setFilterCategory("all");
    setPricePreset("all");
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery !== "" || filterType !== "all" || filterState !== "all" || filterCategory !== "all" || pricePreset !== "all";

  const typePills = [
    { id: "all", label: language === "es" ? "Todos los Inmuebles" : "All Properties", icon: Building2 },
    { id: "casa", label: language === "es" ? "Casas" : "Houses", icon: Home },
    { id: "terreno", label: language === "es" ? "Terrenos" : "Land", icon: Trees },
    { id: "comercio", label: language === "es" ? "Comercios / Locales" : "Commercial", icon: Store },
    { id: "salon_fiestas", label: language === "es" ? "Salones de Eventos" : "Event Halls", icon: PartyPopper },
  ];

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
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              {t.casas.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-foreground/70">{t.casas.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-8 md:py-12 bg-slate-50/50">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Top Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 mb-8 space-y-4">
            {/* Row 1: Search Input + Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Keyword Search */}
              <div className="md:col-span-5 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === "es" ? "Buscar por ciudad, estado o palabra clave..." : "Search by city, state or keywords..."}
                  className="w-full pl-11 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title="Borrar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* State Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="all">{language === "es" ? "📍 Todos los Estados" : "📍 All States"}</option>
                  {states
                    .filter((s) => s !== "all")
                    .map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                </select>
              </div>

              {/* Price Preset Dropdown */}
              <div className="md:col-span-2">
                <select
                  value={pricePreset}
                  onChange={(e) => setPricePreset(e.target.value as any)}
                  className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="all">{language === "es" ? "💲 Todos los precios" : "💲 All prices"}</option>
                  <option value="under100k">&lt; $100k USD</option>
                  <option value="100k-200k">$100k - $200k USD</option>
                  <option value="over200k">&gt; $200k USD</option>
                </select>
              </div>

              {/* Operation Dropdown (Compra / Renta) */}
              <div className="md:col-span-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="all">{language === "es" ? "🏷️ Compra y Renta" : "🏷️ Buy & Rent"}</option>
                  <option value="compra">{language === "es" ? "Comprar" : "For Sale"}</option>
                  <option value="renta">{language === "es" ? "Rentar" : "For Rent"}</option>
                </select>
              </div>
            </div>

            {/* Row 2: Quick Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
              {typePills.map((pill) => {
                const Icon = pill.icon;
                const isSelected = filterType === pill.id;
                const count = pill.id === "all"
                  ? allProperties.length
                  : allProperties.filter((p) => p.type === pill.id).length;

                return (
                  <button
                    key={pill.id}
                    onClick={() => setFilterType(pill.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pill.label}</span>
                    <span
                      className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors ml-auto shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === "es" ? "Limpiar filtros" : "Clear filters"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Properties Header & Count */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {language === "es"
                  ? `${filteredProperties.length} ${filteredProperties.length === 1 ? "Propiedad disponible" : "Propiedades disponibles"}`
                  : `${filteredProperties.length} ${filteredProperties.length === 1 ? "Property available" : "Properties available"}`}
              </h2>
              {hasActiveFilters && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "es" ? "Filtros activos aplicados" : "Active filters applied"}
                </p>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                {language === "es" ? "Restablecer catálogo" : "Reset catalog"}
              </button>
            )}
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-lg text-slate-500">
                {language === "es" ? "Cargando propiedades..." : "Loading properties..."}
              </p>
            </div>
          ) : filteredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {language === "es" ? "Anterior" : "Previous"}
                  </button>
                  <span className="text-slate-600 text-sm font-medium">
                    {language === "es" ? "Página" : "Page"} {currentPage} {language === "es" ? "de" : "of"} {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {language === "es" ? "Siguiente" : "Next"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-lg text-slate-700 font-semibold mb-2">
                {allProperties.length === 0 && !hasActiveFilters
                  ? language === "es"
                    ? "Catálogo en actualización"
                    : "Catalog currently updating"
                  : language === "es"
                    ? "No se encontraron inmuebles con estos criterios"
                    : "No properties match your search criteria"}
              </p>
              <p className="text-sm text-slate-500 mb-5">
                {allProperties.length === 0 && !hasActiveFilters
                  ? language === "es"
                    ? "Muy pronto verás aquí nuestras nuevas propiedades disponibles."
                    : "New verified properties will be published here shortly."
                  : language === "es"
                    ? "Intenta buscar con otra palabra clave o limpiando los filtros."
                    : "Try searching with different keywords or clearing active filters."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{language === "es" ? "Ver todo el catálogo" : "View all properties"}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
