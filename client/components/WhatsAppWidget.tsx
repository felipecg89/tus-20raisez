import { useState } from "react";
import { MessageCircle, X, Send, ExternalLink, Phone, CheckCheck } from "lucide-react";
import {
  CONTACT_CONFIG,
  getWhatsAppUrl,
  getWhatsAppWebUrl,
  isMobileBrowser,
} from "@/lib/contact";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhatsAppWidget = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [customText, setCustomText] = useState("");

  const defaultMessage =
    language === "es"
      ? "¡Hola! Vivo en EE.UU. y me gustaría recibir asesoría sobre comprar casa, crédito Infonavit o trámites en México."
      : "Hello! I live in the US and would like advice on buying property, Infonavit credit, or legal procedures in Mexico.";

  const quickOptions =
    language === "es"
      ? [
          {
            label: "🏡 Comprar casa o terreno",
            text: "Hola, me interesa comprar una propiedad en México desde Estados Unidos. ¿Cuáles son las opciones de financiamiento y requisitos?",
          },
          {
            label: "📑 Trámites y escrituración",
            text: "Hola, necesito asesoría legal para realizar escrituras y poderes notariales en México sin tener que viajar.",
          },
          {
            label: "💼 Pensión IMSS / Modalidad 40",
            text: "Hola, vivo en EE.UU. y quiero cotizar o reactivar mis semanas del IMSS con Modalidad 40 para pensionarme en México.",
          },
          {
            label: "💬 Hablar con un asesor",
            text: defaultMessage,
          },
        ]
      : [
          {
            label: "🏡 Buy home or land",
            text: "Hello, I am interested in buying property in Mexico from the US. What are the requirements and financing options?",
          },
          {
            label: "📑 Legal & notary deeds",
            text: "Hello, I need legal guidance for property deeds and notary powers of attorney in Mexico without traveling.",
          },
          {
            label: "💼 IMSS Pension / Mod 40",
            text: "Hello, I live in the US and would like information about recovering my IMSS pension rights with Modalidad 40.",
          },
          {
            label: "💬 Chat with advisor",
            text: defaultMessage,
          },
        ];

  const handleSend = (forceWeb: boolean = false) => {
    const textToSend = customText.trim() || defaultMessage;
    const url = forceWeb
      ? getWhatsAppWebUrl(textToSend)
      : isMobileBrowser()
      ? getWhatsAppUrl(textToSend)
      : getWhatsAppWebUrl(textToSend);

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2.5 print:hidden">
      {/* WhatsApp Web Interactive Card / Modal */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header styled like WhatsApp Business */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-inner overflow-hidden border border-emerald-300">
                  <img src="/logo.png" alt="Tus Raíces" className="w-full h-full object-contain" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base leading-tight">
                  Tus Raíces Asesores
                </h4>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  {language === "es"
                    ? "En línea • Responde en minutos"
                    : "Online • Replies in minutes"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Cerrar ventana de WhatsApp"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Content Body */}
          <div className="p-4 bg-[#f0f2f5] space-y-3 max-h-[360px] overflow-y-auto">
            {/* Incoming message bubble */}
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-slate-100 max-w-[88%] text-xs sm:text-sm text-slate-800 space-y-1">
              <p className="font-semibold text-emerald-800 text-[11px] uppercase tracking-wider">
                {language === "es" ? "Atención Especial Paisanos 🇺🇸🇲🇽" : "US Hispanic Support 🇺🇸🇲🇽"}
              </p>
              <p>
                {language === "es"
                  ? "¡Hola! 👋 Bienvenido a Tus Raíces. Te asesoramos directamente desde EE.UU. para compras, créditos y trámites en México."
                  : "Hello! 👋 Welcome to Tus Raíces. We guide you directly from the US for home purchases and legal paperwork in Mexico."}
              </p>
              <p className="text-slate-500 text-[10px] text-right flex items-center justify-end gap-1">
                <span>{language === "es" ? "Ahora" : "Just now"}</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
              </p>
            </div>

            {/* Quick intent buttons */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-semibold text-slate-600 px-1">
                {language === "es" ? "Selecciona tu consulta rápida:" : "Select quick topic:"}
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {quickOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomText(opt.text);
                    }}
                    className={`text-left text-xs p-2 rounded-xl transition-all border ${
                      customText === opt.text
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-medium"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input & Sending Actions */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend(false);
                  }
                }}
                placeholder={
                  language === "es"
                    ? "Escribe tu mensaje aquí..."
                    : "Type your message here..."
                }
                className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => handleSend(false)}
                className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                aria-label="Enviar por WhatsApp"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            {/* Direct Web vs App Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-600 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSend(true)}
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                {language === "es" ? "Abrir en WhatsApp Web" : "Open in WhatsApp Web"}
              </button>

              <a
                href={`tel:${CONTACT_CONFIG.phoneUSARaw}`}
                className="text-slate-600 hover:text-primary font-medium flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3 h-3" />
                {language === "es" ? "Llamar 1-888-431-2431" : "Call 1-888-431-2431"}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Speech bubble / Tooltip when closed */}
      {!isOpen && showTooltip && (
        <div className="relative bg-white text-slate-800 text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-xl shadow-2xl border border-emerald-100 flex items-center gap-2 max-w-xs animate-fade-in-up">
          <button
            onClick={() => setIsOpen(true)}
            className="text-left hover:text-emerald-700 transition-colors"
          >
            {language === "es" ? (
              <>
                <span className="font-bold text-emerald-700">🇺🇸 ¿Dudas desde EE.UU.?</span>{" "}
                Abre WhatsApp Web o Móvil
              </>
            ) : (
              <>
                <span className="font-bold text-emerald-700">🇺🇸 Questions from the US?</span>{" "}
                Open WhatsApp Web or Mobile
              </>
            )}
          </button>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            aria-label="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        aria-label={isOpen ? "Cerrar WhatsApp" : "Abrir chat de WhatsApp"}
        className={`group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${
          isOpen ? "bg-[#075E54] hover:bg-[#054c44]" : "bg-[#25D366] hover:bg-[#20ba59]"
        } text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300`}
      >
        {/* Pulsing ring animation when closed */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping"></span>
        )}

        {isOpen ? (
          <X className="w-7 h-7 relative z-10 transition-transform duration-200" />
        ) : (
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white relative z-10" />
        )}

        {/* Small Country Flag Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 text-xs bg-white text-slate-800 font-bold px-1.5 py-0.5 rounded-full shadow border border-slate-200">
            🇺🇸
          </span>
        )}
      </button>
    </div>
  );
};
