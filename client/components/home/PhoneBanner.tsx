import { Phone } from "lucide-react";

export const PhoneBanner = () => {
  return (
    <section className="bg-gradient-turquoise-sky text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase opacity-90">🇺🇸 USA</span>
              <div className="flex gap-2 text-sm font-medium">
                <a href="tel:+18887209656" className="hover:opacity-80 transition-opacity">
                  +1 (888) 720-9656
                </a>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-white/30"></div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase opacity-90">🇲🇽 México</span>
              <div className="flex gap-2 flex-wrap text-sm font-medium">
                <a href="tel:+18003511039" className="hover:opacity-80 transition-opacity">
                  +1 (800) 351-1039
                </a>
                <span className="opacity-50">•</span>
                <a href="tel:+524923860125" className="hover:opacity-80 transition-opacity">
                  +52 (492) 386-0125
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
