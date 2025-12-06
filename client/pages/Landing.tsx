import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import {
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Users,
  Zap,
} from "lucide-react";

export default function Landing() {
  const { language } = useLanguage();
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "casas",
  });
  const [submitted, setSubmitted] = useState(false);

  const content = {
    es: {
      title: "Comienza tu Viaje hacia tu Sueño en México",
      subtitle:
        "Conectamos paisanos con sus metas: casas, seguridad social y asesoría legal",
      cta: "Completa el formulario abajo para comenzar",
      whatYouGet: "¿Qué obtendrás?",
      getItems: [
        "Consulta inicial GRATUITA con nuestro equipo de expertos",
        "Plan personalizado según tus necesidades",
        "Apoyo total en cada paso del proceso",
        "Respuesta garantizada en menos de 1 hora",
      ],
      formTitle: "Cuéntanos sobre ti",
      formSubtitle:
        "Para poder ayudarte mejor, necesitamos entender qué buscas",
      formName: "Nombre Completo",
      formEmail: "Email",
      formPhone: "WhatsApp",
      formInterest: "¿Qué te interesa?",
      interests: {
        casas: "Comprar Casa o Terreno",
        imss: "IMSS e Infonavit",
        legal: "Asesoría Legal",
        multiple: "Todos los servicios",
      },
      formSubmit: "Comenzar Ahora",
      formSubmitting: "Procesando...",
      successTitle: "¡Bienvenido!",
      successMessage:
        "Tu solicitud ha sido recibida. Un asesor se pondrá en contacto contigo en menos de 1 hora.",
      successCTA: "Volver al inicio",
      whyNow: "¿Por qué comenzar ahora?",
      reasons: [
        {
          icon: "⏰",
          title: "Sin Esperas",
          desc: "Proceso ágil y transparente",
        },
        {
          icon: "🔒",
          title: "100% Seguro",
          desc: "Protegemos tu información",
        },
        {
          icon: "👥",
          title: "Equipo Experto",
          desc: "18+ años de experiencia",
        },
        {
          icon: "💡",
          title: "Solución Completa",
          desc: "Todos tus trámites en un lugar",
        },
      ],
    },
    en: {
      title: "Begin Your Journey Towards Your Dream in Mexico",
      subtitle:
        "We connect Mexicans abroad with their goals: homes, social security and legal advice",
      cta: "Fill out the form below to get started",
      whatYouGet: "What You'll Get",
      getItems: [
        "FREE initial consultation with our expert team",
        "Personalized plan based on your needs",
        "Full support at every step of the process",
        "Response guaranteed within 1 hour",
      ],
      formTitle: "Tell us about yourself",
      formSubtitle: "To better help you, we need to understand what you're looking for",
      formName: "Full Name",
      formEmail: "Email",
      formPhone: "WhatsApp",
      formInterest: "What interests you?",
      interests: {
        casas: "Buy Home or Land",
        imss: "IMSS and Infonavit",
        legal: "Legal Advice",
        multiple: "All services",
      },
      formSubmit: "Get Started Now",
      formSubmitting: "Processing...",
      successTitle: "Welcome!",
      successMessage:
        "Your request has been received. An advisor will contact you within 1 hour.",
      successCTA: "Back to Home",
      whyNow: "Why start now?",
      reasons: [
        {
          icon: "⏰",
          title: "No Waiting",
          desc: "Quick and transparent process",
        },
        {
          icon: "🔒",
          title: "100% Secure",
          desc: "We protect your information",
        },
        {
          icon: "👥",
          title: "Expert Team",
          desc: "18+ years of experience",
        },
        {
          icon: "💡",
          title: "Complete Solution",
          desc: "All your procedures in one place",
        },
      ],
    },
  };

  const lang = language === "es" ? content.es : content.en;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Send to Formspree
      const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          interest: formData.interest,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          {!submitted ? (
            <>
              {/* Hero Section */}
              <section className="max-w-3xl mx-auto mb-16 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  {lang.title}
                </h1>
                <p className="text-lg md:text-xl text-foreground/70 mb-8">
                  {lang.subtitle}
                </p>
                <p className="text-primary font-semibold">{lang.cta}</p>
              </section>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Left Column - What You Get */}
                <div className="order-2 lg:order-1">
                  <h2 className="text-3xl font-bold text-foreground mb-8">
                    {lang.whatYouGet}
                  </h2>
                  <div className="space-y-4">
                    {lang.getItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-foreground/80 font-medium">{item}</p>
                      </div>
                    ))}
                  </div>

                  {/* Why Now - Mobile friendly cards */}
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold text-foreground mb-6">
                      {lang.whyNow}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {lang.reasons.map((reason, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20"
                        >
                          <div className="text-3xl mb-2">{reason.icon}</div>
                          <h4 className="font-bold text-foreground text-sm mb-1">
                            {reason.title}
                          </h4>
                          <p className="text-xs text-foreground/70">
                            {reason.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div className="order-1 lg:order-2">
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 border-2 border-primary/20 sticky top-20">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {lang.formTitle}
                    </h3>
                    <p className="text-foreground/70 mb-6">
                      {lang.formSubtitle}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          {lang.formName}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          placeholder={lang.formName}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          {lang.formEmail}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          placeholder={lang.formEmail}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          {lang.formPhone}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      {/* Interest */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          {lang.formInterest}
                        </label>
                        <select
                          name="interest"
                          value={formData.interest}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        >
                          <option value="casas">{lang.interests.casas}</option>
                          <option value="imss">{lang.interests.imss}</option>
                          <option value="legal">{lang.interests.legal}</option>
                          <option value="multiple">
                            {lang.interests.multiple}
                          </option>
                        </select>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-6"
                      >
                        <Zap className="w-5 h-5" />
                        {lang.formSubmit}
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      {/* Privacy Note */}
                      <p className="text-xs text-foreground/60 text-center">
                        {language === "es"
                          ? "✓ Protegemos tu privacidad. Sin spam."
                          : "✓ We protect your privacy. No spam."}
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
              </div>

              <h2 className="text-4xl font-bold text-foreground mb-4">
                {lang.successTitle}
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                {lang.successMessage}
              </p>

              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20 mb-8">
                <p className="text-foreground font-semibold mb-4">
                  {language === "es"
                    ? "Mientras tanto, puedes:"
                    : "In the meantime, you can:"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {language === "es" ? "Chat WhatsApp" : "Chat WhatsApp"}
                  </a>
                  <a
                    href="/casas"
                    className="inline-block border-2 border-primary text-primary px-6 py-2 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                  >
                    {language === "es" ? "Ver Propiedades" : "View Properties"}
                  </a>
                </div>
              </div>

              <a
                href="/"
                className="text-primary font-semibold hover:underline"
              >
                ← {lang.successCTA}
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
