import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-primary mb-4">
              404
            </h1>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.notFound.title}
          </h2>

          <p className="text-lg text-foreground/70 mb-8">
            {t.notFound.message} {t.notFound.help}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {t.notFound.backHome}
            </Link>
            <a
              href="#contacto"
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              {t.notFound.contact}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
