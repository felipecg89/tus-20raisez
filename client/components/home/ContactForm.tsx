import { useState } from "react";
import { Mail, Phone, Clock, Send, MessageCircle, CalendarCheck, X, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { submitHubSpotForm } from "@/lib/hubspotService";
import {
  CALL_US_DISPLAY,
  CALL_US_TEL,
  CALL_MX_DISPLAY,
  CALL_MX_TEL,
  WHATSAPP_DISPLAY,
  CONTACT_EMAIL,
  CONTACT_HOURS_ES,
  getWhatsAppUrl,
  getCallUrl,
} from "@/config/contact";

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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

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
        setSubmitMessage(
          language === "es"
            ? "¡Mensaje enviado con éxito! Un asesor te contactará en menos de 1 hora."
            : "Message sent successfully! An advisor will reach out in less than 1 hour."
        );
        setFormData({ name: "", whatsapp: "", email: "", city: "" });
        setTimeout(() => {
          setSubmitMessage("");
          setIsBottomSheetOpen(false);
        }, 4000);
      } else {
        setSubmitMessage(
          language === "es"
            ? "Ocurrió un error. Por favor inténtalo de nuevo o contáctanos por WhatsApp."
            : "An error occurred. Please try again or reach out via WhatsApp."
        );
      }
    } catch (error) {
      setSubmitMessage(
        language === "es"
          ? "Ocurrió un error al enviar el formulario."
          : "An error occurred while submitting the form."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contacto" className="py-16 md:py-24 bg-[#F7F8FA] border-t border-[#DFE5EA]">
        <div className="container mx-auto px-4">
          {/* Contenedor dividido en PC */}
          <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden border border-[#DFE5EA] shadow-xl grid grid-cols-1 lg:grid-cols-12 bg-white">
            
            {/* Columna Izquierda: Azul Hogar Sereno #1B4965 con canales oficiales */}
            <div className="lg:col-span-5 bg-[#1B4965] text-white p-5 sm:p-8 md:p-12 flex flex-col justify-between space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full">
                  {language === "es" ? "Atención Personalizada" : "Dedicated Support"}
                </span>
                <h2 className="font-heading font-extrabold text-2xl md:text-3xl lg:text-4xl text-white leading-tight">
                  {t.contactForm.title || "¿Listo para dar el siguiente paso?"}
                </h2>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                  {t.contactForm.subtitle ||
                    "Estamos listos para atenderte desde Estados Unidos y resolver todas tus dudas sobre propiedades, escrituras o pensión IMSS."}
                </p>
              </div>

              {/* Botones y canales directos */}
              <div className="space-y-4">
                {/* WhatsApp Directo */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    {language === "es" ? "WhatsApp Oficial Binacional" : "Official WhatsApp"}
                  </p>
                  <a
                    href={getWhatsAppUrl("Hola, me gustaría agendar una asesoría gratuita sobre trámites y propiedades en México.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-wrap items-center justify-between gap-2 w-full p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 text-xs sm:text-sm font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <MessageCircle className="w-4 h-4 fill-white" />
                      </div>
                      <span>WhatsApp Business Oficial</span>
                    </div>
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-mono whitespace-nowrap">
                      {WHATSAPP_DISPLAY}
                    </span>
                  </a>
                </div>

                {/* Líneas Gratuitas Zadarma */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      {language === "es" ? "Líneas Telefónicas Gratuitas" : "Toll-Free Numbers"}
                    </p>
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      {language === "es" ? "Llamadas 100% sin costo" : "100% Free of Charge"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <a
                      href={getCallUrl("us")}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 flex flex-col gap-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-200 font-semibold">🇺🇸 USA Toll-Free</span>
                        <span className="text-[10px] text-emerald-300 font-bold">Sin Costo</span>
                      </div>
                      <span className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                        {CALL_US_DISPLAY}
                      </span>
                      <span className="text-[10px] text-slate-300">
                        {language === "es" ? "Llamada 100% gratuita desde EE. UU." : "100% free call from the US"}
                      </span>
                    </a>
                    <a
                      href={getCallUrl("mx")}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 flex flex-col gap-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-200 font-semibold">🇲🇽 México Lada 800</span>
                        <span className="text-[10px] text-emerald-300 font-bold">Sin Costo</span>
                      </div>
                      <span className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                        {CALL_MX_DISPLAY}
                      </span>
                      <span className="text-[10px] text-slate-300">
                        {language === "es" ? "Lada gratuita nacional en México" : "Toll-free nationwide in Mexico"}
                      </span>
                    </a>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>
                      {language === "es"
                        ? "Nuestras líneas telefónicas son 100% gratuitas y sin costo alguno para ti al llamar desde EE. UU. o México."
                        : "All calls to our toll-free lines are 100% free of charge from the US or Mexico."}
                    </span>
                  </p>
                </div>

                {/* Correo y Horario */}
                <div className="pt-2 border-t border-white/10 space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-300">
                    <Clock className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <span>{CONTACT_HOURS_ES}</span>
                  </div>
                </div>
              </div>

              {/* Nota de respuesta rápida */}
              <div className="text-[11px] text-slate-300/80 pt-2 border-t border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  {language === "es"
                    ? "Tiempo habitual de respuesta: menos de 15 minutos."
                    : "Average response time: under 15 minutes."}
                </span>
              </div>
            </div>

            {/* Columna Derecha: Formulario conectado a HubSpot */}
            <div className="lg:col-span-7 p-5 sm:p-8 md:p-12 bg-white flex flex-col justify-center">
              <div className="mb-6 space-y-1">
                <h3 className="font-heading font-bold text-2xl text-[#101B24]">
                  {language === "es" ? "Envíanos un mensaje" : "Send us a message"}
                </h3>
                <p className="text-xs text-[#465664]">
                  {language === "es"
                    ? "Completa tus datos y un especialista asignado se comunicará contigo hoy mismo."
                    : "Fill in your details and a dedicated specialist will contact you today."}
                </p>
              </div>

              {submitMessage && (
                <div
                  className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 ${
                    submitMessage.includes("éxito") || submitMessage.includes("success")
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{submitMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#101B24] mb-1">
                    {t.contactForm.nameLabel || "Nombre Completo"} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={language === "es" ? "Ej. Juan Martínez" : "e.g. John Martinez"}
                    className="w-full bg-[#F7F8FA] border border-[#DFE5EA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#101B24] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#101B24] mb-1">
                      {t.contactForm.whatsappLabel || "WhatsApp / Teléfono"} *
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#F7F8FA] border border-[#DFE5EA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#101B24] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#101B24] mb-1">
                      {t.contactForm.emailLabel || "Correo Electrónico"} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="tu@email.com"
                      className="w-full bg-[#F7F8FA] border border-[#DFE5EA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#101B24] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#101B24] mb-1">
                    {t.contactForm.cityLabel || "Ciudad donde vives (EE. UU. o México)"} *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder={language === "es" ? "Ej. Los Ángeles, CA / Dallas, TX / Zacatecas" : "e.g. Los Angeles, CA / Dallas, TX"}
                    className="w-full bg-[#F7F8FA] border border-[#DFE5EA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#101B24] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#1B4965] hover:bg-[#13374E] text-white py-3.5 px-6 rounded-xl font-bold text-sm min-h-[48px] transition-all shadow-md active:scale-[0.99] disabled:opacity-70 mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (language === "es" ? "Enviando..." : "Sending...")
                      : (t.contactForm.submitButton || "Agendar asesoría gratuita")}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* BARRA FIJA INFERIOR ERGONÓMICA PARA PULGAR EN CELULAR (< 768px)    */}
      {/* ------------------------------------------------------------------- */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DFE5EA] h-16 px-4 flex items-center justify-between gap-3 shadow-2xl md:hidden print:hidden">
        {/* Botón WhatsApp */}
        <a
          href={getWhatsAppUrl("Hola, me gustaría agendar una asesoría gratuita desde EE. UU.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-3 rounded-2xl font-bold text-xs h-12 shadow active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp</span>
        </a>

        {/* Botón Agendar gratis (Abre Bottom Sheet) */}
        <button
          type="button"
          onClick={() => setIsBottomSheetOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1B4965] hover:bg-[#13374E] text-white py-2.5 px-3 rounded-2xl font-bold text-xs h-12 shadow active:scale-95 transition-all"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{language === "es" ? "Agendar gratis" : "Book Free"}</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* CAJÓN DESLIZABLE INFERIOR (BOTTOM SHEET) PARA CELULAR               */}
      {/* ------------------------------------------------------------------- */}
      {isBottomSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border-t border-[#DFE5EA] animate-in slide-in-from-bottom duration-300 space-y-4"
          >
            {/* Header del cajón */}
            <div className="flex items-center justify-between pb-3 border-b border-[#DFE5EA]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1B4965]/10 flex items-center justify-center text-[#1B4965]">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-[#101B24]">
                    {language === "es" ? "Agendar Asesoría Gratuita" : "Schedule Free Advice"}
                  </h4>
                  <p className="text-[11px] text-[#465664]">
                    {language === "es" ? "Sin costo ni compromiso" : "No cost, no obligation"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBottomSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                aria-label="Cerrar formulario"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  submitMessage.includes("éxito") || submitMessage.includes("success")
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{submitMessage}</span>
              </div>
            )}

            {/* Formulario móvil conectado a HubSpot */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#101B24] mb-1">
                  {t.contactForm.nameLabel || "Nombre"} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={language === "es" ? "Tu nombre completo" : "Your full name"}
                  className="w-full bg-[#F7F8FA] border border-[#DFE5EA] rounded-xl px-3.5 py-2.5 text-xs text-[#101B24] focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101B24] mb-1">
                  {t.contactForm.whatsappLabel || "WhatsApp / Teléfono"} *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#F7F8FA] border border-[#DFE5EA] rounded-xl px-3.5 py-2.5 text-xs text-[#101B24] focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101B24] mb-1">
                  {t.contactForm.emailLabel || "Correo Electrónico"} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="w-full bg-[#F7F8FA] border border-[#DFE5EA] rounded-xl px-3.5 py-2.5 text-xs text-[#101B24] focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101B24] mb-1">
                  {t.contactForm.cityLabel || "Ciudad donde vives"} *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Los Ángeles, CA / Dallas, TX"
                  className="w-full bg-[#F7F8FA] border border-[#DFE5EA] rounded-xl px-3.5 py-2.5 text-xs text-[#101B24] focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1B4965] hover:bg-[#13374E] text-white py-3 px-4 rounded-xl font-bold text-xs min-h-[48px] shadow-md transition-all active:scale-[0.99] disabled:opacity-70 mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isSubmitting
                    ? (language === "es" ? "Enviando..." : "Sending...")
                    : (language === "es" ? "Confirmar y recibir llamada" : "Confirm and receive call")}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};