import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { submitHubSpotForm } from "@/lib/hubspotService";

export const ContactForm = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    city: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitHubSpotForm({
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email,
        city: formData.city,
      });

      if (result.success) {
        setSubmitMessage(t.contactForm.successMessage);
        setFormData({ name: "", whatsapp: "", email: "", city: "" });
        setTimeout(() => setSubmitMessage(""), 5000);
      } else {
        setSubmitMessage(t.contactForm.errorMessage);
      }
    } catch (error) {
      setSubmitMessage(t.contactForm.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Side - Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t.contactForm.title}
                </h2>
                <p className="text-lg text-foreground/70">
                  {t.contactForm.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t.contactForm.whatsappLabel}
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">🇺🇸 USA</p>
                        <a
                          href="https://wa.me/18887209656"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          +1 (888) 720-9656
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">🇲🇽 México</p>
                        <div className="flex gap-2">
                          <a
                            href="https://wa.me/18003511039"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            +1 (800) 351-1039
                          </a>
                          <a
                            href="https://wa.me/524923860125"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            +52 (492) 386-0125
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t.contactForm.emailLabel}
                    </h3>
                    <a
                      href="mailto:asesores@tusraices.com.mx"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      asesores@tusraices.com.mx
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t.contactForm.hoursLabel}
                    </h3>
                    <p className="text-foreground/70">{t.contactForm.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-border">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t.contactForm.nameLabel}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder={t.contactForm.namePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t.contactForm.whatsappLabel}
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder={t.contactForm.whatsappPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t.contactForm.emailLabel}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder={t.contactForm.emailPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t.contactForm.cityLabel}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder={t.contactForm.cityPlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-turquoise-sky text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? t.contactForm.submitting : t.contactForm.submitButton}
                </button>

                {submitMessage && (
                  <div
                    className={`p-4 rounded-lg text-center text-sm font-medium ${
                      submitMessage.includes(language === "es" ? "Gracias" : "Thank")
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                <p className="text-xs text-foreground/60 text-center">
                  {t.contactForm.responseTime}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
