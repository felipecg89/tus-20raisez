import { PagePlaceholder } from "@/components/PagePlaceholder";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export default function Legal() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <PagePlaceholder
      title={t.legal.title}
      description={t.legal.description}
    />
  );
}
