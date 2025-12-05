import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export const PagePlaceholder = ({
  title,
  description,
}: PagePlaceholderProps) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h1>

          <p className="text-lg text-foreground/70 mb-8">{description}</p>

          <p className="text-foreground/60 mb-8">
            {t.pagePlaceholder.inDevelopment}{" "}
            {t.pagePlaceholder.explore}
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
              {t.header.hablaConAsesor}
            </a>
          </div>

          <div className="mt-12 p-8 bg-primary/5 rounded-2xl border border-primary/20">
            <p className="text-foreground/70">
              🎯 {t.pagePlaceholder.note}{" "}
              <a href="#contacto" className="text-primary font-semibold hover:underline">
                {t.pagePlaceholder.contactUs}
              </a>{" "}
              {t.pagePlaceholder.orSend}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
