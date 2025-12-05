import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Text Content */}
          <div className="flex flex-col justify-center space-y-6 animate-fade-in-up">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Conecta tus sueños de{" "}
                <span className="text-primary">Estados Unidos</span> con tu hogar
                en <span className="text-secondary">México</span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-foreground/70">
              Casas, trámites y asesoría legal para paisanos. Realizamos tus
              sueños de propiedad desde cualquier lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg">
                Quiero empezar
              </button>
              <button className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/5 transition-colors text-lg">
                Conocer más
              </button>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative h-96 md:h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-2">🏠</div>
                  <p className="text-xl font-semibold">Tu casa en México</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
