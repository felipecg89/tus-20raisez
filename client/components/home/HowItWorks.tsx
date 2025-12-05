import { Phone, CheckCircle, FileCheck, Handshake } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const HowItWorks = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const steps = [
    {
      number: 1,
      icon: Phone,
      title: t.howItWorks.step1.title,
      description: t.howItWorks.step1.description,
    },
    {
      number: 2,
      icon: CheckCircle,
      title: t.howItWorks.step2.title,
      description: t.howItWorks.step2.description,
    },
    {
      number: 3,
      icon: FileCheck,
      title: t.howItWorks.step3.title,
      description: t.howItWorks.step3.description,
    },
    {
      number: 4,
      icon: Handshake,
      title: t.howItWorks.step4.title,
      description: t.howItWorks.step4.description,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t.howItWorks.title}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={index} className="relative">
                {/* Connector line */}
                {!isLast && (
                  <div className="hidden md:block absolute top-16 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-secondary"></div>
                )}

                <div className="bg-white rounded-2xl border border-border shadow-lg p-8 h-full hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/20">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-primary/20">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Connector */}
        <div className="md:hidden flex flex-col items-center mt-8 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-1 bg-gradient-to-b from-primary to-secondary"
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};
