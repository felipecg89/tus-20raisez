import { PagePlaceholder } from "@/components/PagePlaceholder";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export default function Casas() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <PagePlaceholder
      title={t.casas.title}
      description={t.casas.description}
    />
  );
}
