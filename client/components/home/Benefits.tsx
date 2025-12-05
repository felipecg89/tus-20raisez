import { Check } from "lucide-react";

const benefits = [
  "Atención en tu idioma - español e inglés",
  "Pagos seguros desde Estados Unidos",
  "Asesor legal incluido en todos los servicios",
  "Acompañamiento total en cada paso",
  "Respuesta garantizada en menos de 1 hora",
  "Servicio 100% digital y presencial en México",
  "Sin sorpresas - precios transparentes",
  "Años de experiencia con paisanos",
];

export const Benefits = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-foreground/70">
              Ofrecemos lo mejor para paisanos que desean invertir en su futuro
              en México.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-foreground font-medium">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Listo para empezar?
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              Habla con uno de nuestros asesores hoy mismo. Tu consulta inicial
              es completamente gratis.
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors text-lg">
              Agendar llamada gratis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
