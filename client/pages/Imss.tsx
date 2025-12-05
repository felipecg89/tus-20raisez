import { PagePlaceholder } from "@/components/PagePlaceholder";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export default function Imss() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <PagePlaceholder
      title={t.imss.title}
      description={t.imss.description}
    />
  );
}
