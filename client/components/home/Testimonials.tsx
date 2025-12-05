import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export const Testimonials = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const testimonials = [
    {
      text: t.testimonials.testimonial1.text,
      name: t.testimonials.testimonial1.name,
      location: t.testimonials.testimonial1.location,
      initials: "MG",
      rating: 5,
    },
    {
      text: t.testimonials.testimonial2.text,
      name: t.testimonials.testimonial2.name,
      location: t.testimonials.testimonial2.location,
      initials: "CL",
      rating: 5,
    },
    {
      text: t.testimonials.testimonial3.text,
      name: t.testimonials.testimonial3.name,
      location: t.testimonials.testimonial3.location,
      initials: "AM",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t.testimonials.title}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 border border-border hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-secondary text-secondary"
                  />
                ))}
              </div>

              <p className="text-foreground/80 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
