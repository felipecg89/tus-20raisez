import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Sliders } from "lucide-react";

interface RentalProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  type: "casa" | "terreno" | "departamento" | "oficina";
  state: string;
  rentalPrice?: number;
  rentalPeriod?: "monthly" | "yearly";
}

const rentalProperties: RentalProperty[] = [
  {
    id: "r1",
    title: "Casa Moderna Monterrey - Alquiler",
    price: 1200,
    rentalPrice: 1200,
    rentalPeriod: "monthly",
    location: "Monterrey, NL",
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    description:
      "Hermosa casa moderna en zona segura, perfecta para familia. Incluye: garaje, jardín, servicios básicos.",
    type: "casa",
    state: "Nuevo León",
  },
  {
    id: "r2",
    title: "Departamento Playa Vallarta - Alquiler",
    price: 1800,
    rentalPrice: 1800,
    rentalPeriod: "monthly",
    location: "Puerto Vallarta, JAL",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    description:
      "Departamento con vista al mar, amueblado, ideal para ejecutivos o turismo de larga estancia.",
    type: "departamento",
    state: "Jalisco",
  },
  {
    id: "r3",
    title: "Casa Céntrica Guanajuato - Alquiler",
    price: 900,
    rentalPrice: 900,
    rentalPeriod: "monthly",
    location: "Guanajuato, GTO",
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    description:
      "Casa en el corazón del centro histórico, ideal para estudiantes o parejas jóvenes.",
    type: "casa",
    state: "Guanajuato",
  },
  {
    id: "r4",
    title: "Oficina Corporativa CDMX - Alquiler",
    price: 2500,
    rentalPrice: 2500,
    rentalPeriod: "monthly",
    location: "CDMX",
    bedrooms: 0,
    bathrooms: 2,
    area: 180,
    description:
      "Oficina moderna, totalmente equipada, en zona de negocios premium con estacionamiento.",
    type: "oficina",
    state: "Ciudad de México",
  },
  {
    id: "r5",
    title: "Terreno Agrícola Michoacán - Alquiler",
    price: 300,
    rentalPrice: 300,
    rentalPeriod: "monthly",
    location: "Morelia, MICH",
    bedrooms: 0,
    bathrooms: 0,
    area: 5000,
    description:
      "Terreno para cultivo o inversión, acceso a agua, zona fértil.",
    type: "terreno",
    state: "Michoacán",
  },
  {
    id: "r6",
    title: "Casa Vacacional Oaxaca - Alquiler",
    price: 1500,
    rentalPrice: 1500,
    rentalPeriod: "monthly",
    location: "Oaxaca, OAX",
    bedrooms: 3,
    bathrooms: 2,
    area: 250,
    description:
      "Casa con piscina y terraza, perfecta para vacaciones o retiros corporativos.",
    type: "casa",
    state: "Oaxaca",
  },
];

export default function Rentals() {
  const { language } = useLanguage();
  const t = translations[language];
  const [filterType, setFilterType] = useState<"all" | string>("all");
  const [filterState, setFilterState] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  const states = ["all", ...new Set(rentalProperties.map((p) => p.state))];

  const filteredProperties = rentalProperties.filter((property) => {
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
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {language === "es"
                ? "Alquila tu Casa o Terreno"
                : "Rent Your Property"}
            </h1>
            <p className="text-lg text-foreground/70">
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

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setFilterType("all");
                    setFilterState("all");
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
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
                      image=""
                      type={property.type}
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

      <Footer />
    </div>
  );
}
