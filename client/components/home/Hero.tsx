import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Hero = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center py-12 md:py-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-center">
          {/* Text Content */}
          <div className="flex flex-col justify-center space-y-4 md:space-y-5 animate-fade-in-up md:col-span-1">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {t.hero.title1}{" "}
                <span className="text-primary">{t.hero.title2}</span>{" "}
                {t.hero.title3}{" "}
                <span className="text-secondary">{t.hero.title4}</span>
              </h1>
            </div>
            <p className="text-base md:text-lg text-foreground/70">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 items-center sm:items-stretch">
              <button
                onClick={() => navigate("/landing")}
                className="w-full sm:flex-1 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg h-auto sm:h-14 flex items-center justify-center"
              >
                {t.hero.cta1}
              </button>
              <button className="w-full sm:flex-1 border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/5 transition-colors text-lg h-auto sm:h-14 flex items-center justify-center">
                {t.hero.cta2}
              </button>
            </div>
          </div>

          {/* Video Content */}
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="w-full max-w-2xl aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source
                  src="https://cdn.builder.io/o/assets%2Fc4331b9719fe4840b03d2b99c1afbc5e%2F511fe795642842bca842f3f15631911e?alt=media&token=f13cebd0-d14a-45a4-ba09-253770c118a6&apiKey=c4331b9719fe4840b03d2b99c1afbc5e"
                  type="video/mp4"
                />
                Tu navegador no soporta videos HTML5
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
