import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María García",
    location: "California, USA",
    text: "Gracias a Tus Raíces MX logré comprar una casa en Jalisco sin tener que viajar. El proceso fue fácil y seguro. Los asesores fueron muy profesionales.",
    rating: 5,
    initials: "MG",
  },
  {
    name: "Carlos López",
    location: "Texas, USA",
    text: "Excelente servicio. Me ayudaron con el trámite de IMSS modalidad 40 y todo se resolvió rápido. Definitivamente los recomiendo a mis paisanos.",
    rating: 5,
    initials: "CL",
  },
  {
    name: "Ana Martínez",
    location: "Nueva York, USA",
    text: "Necesitaba asesoría legal para una herencia en México. El equipo de abogados fue muy profesional y transparente en los costos. 100% recomendado.",
    rating: 5,
    initials: "AM",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Historias de éxito de paisanos que realizaron sus sueños con nuestra
            ayuda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 border border-border hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-secondary text-secondary"
                  />
                ))}
              </div>

              <p className="text-foreground/80 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
