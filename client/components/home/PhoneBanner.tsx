import { Phone } from "lucide-react";

export const PhoneBanner = () => {
  const phones = [
    { number: "+18884312431", flag: "🇺🇸", country: "USA", display: "+1 (888) 431-2431 (Gratuito + SMS)" },
    { number: "+528004610316", flag: "🇲🇽", country: "México", display: "+52 (800) 461-0316 (Lada Gratuita)" },
  ];

  return (
    <section className="bg-gradient-turquoise-sky text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 flex-wrap">
          {phones.map((phone, index) => (
            <div key={index} className="flex items-center gap-2">
              <a
                href={`tel:${phone.number}`}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <span className="w-6 h-6 flex items-center justify-center text-base">{phone.flag}</span>
                <span className="text-sm font-medium whitespace-nowrap">{phone.display}</span>
              </a>
              {index < phones.length - 1 && (
                <span className="hidden md:block opacity-50">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
