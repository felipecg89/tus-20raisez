import { Home, FileText, Scale } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Venta de Casas y Terrenos",
    description:
      "Encuentra propiedades premium en México desde EE.UU. Asesoría completa en todo el proceso de compra sin complicaciones.",
    features: ["Propiedades verificadas", "Pagos desde EE.UU.", "Sin trámites complejos"],
  },
  {
    icon: FileText,
    title: "IMSS e Infonavit Sin Fronteras",
    description:
      "Modalidad 40, modalidad 44 y crédito hipotecario para paisanos. Regístrate y accede a beneficios exclusivos.",
    features: ["Registro desde EE.UU.", "Asesoría especializada", "Respuesta rápida"],
  },
  {
    icon: Scale,
    title: "Asesoría Legal Completa",
    description:
      "Representación legal en México para trámites, herencias, poderes notariales y más. Abogados certificados.",
    features: ["Abogados certificados", "Atención en español", "Confidencialidad garantizada"],
  },
];

export const Services = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Nuestros Servicios Principales
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Soluciones integrales para paisanos que desean invertir en México y
            realizar sus trámites desde Estados Unidos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-border shadow-lg hover:shadow-2xl transition-all duration-300 p-8 hover:border-primary"
              >
                <div className="mb-6 inline-block p-4 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-foreground/70 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Saber más
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
