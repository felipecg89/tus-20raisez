import { useState } from "react";
import { MessageCircle, X, Send, Phone, CheckCheck, ArrowRight, PhoneCall } from "lucide-react";
import {
  CALL_US_DISPLAY,
  CALL_US_TEL,
  CALL_US_LABEL_ES,
  CALL_US_LABEL_EN,
  CALL_MX_DISPLAY,
  CALL_MX_SHORT,
  CALL_MX_TEL,
  CALL_MX_LABEL_ES,
  WHATSAPP_DISPLAY,
  getWhatsAppUrl,
  getCallUrl,
} from "@/config/contact";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhatsAppWidget = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [customText, setCustomText] = useState("");

  const defaultMessage =
    language === "es"
      ? "Hola Tus Raíces MX, vi su página web y quiero asesoría gratuita sobre propiedades y trámites en México."
      : "Hello Tus Raíces MX, I saw your website and would like free advice on properties and legal procedures in Mexico.";

  const quickOptions =
    language === "es"
      ? [
          {
            label: "🏡 Casas y Terrenos",
            text: "Hola Tus Raíces MX, vi Casas y Terrenos en su página web y quiero asesoría gratuita sobre compra y financiamiento.",
          },
          {
            label: "🎉 Salones de Fiestas y Comercios",
            text: "Hola Tus Raíces MX, vi Salones de Fiestas y Locales Comerciales en su página web y quiero asesoría gratuita.",
          },
          {
            label: "📑 Trámites y Escrituración",
            text: "Hola Tus Raíces MX, vi Asesoría Legal y Escrituras en su página web y quiero asesoría sobre poderes notariales sin viajar.",
          },
          {
            label: "💼 Pensión IMSS / Modalidad 40",
            text: "Hola Tus Raíces MX, vi Pensión IMSS / Infonavit en su página web y quiero asesoría gratuita sobre mis semanas cotizadas.",
          },
        ]
      : [
          {
            label: "🏡 Homes & Land in Mexico",
            text: "Hello Tus Raíces MX, I saw your Mexico Properties on your website and would like free advice on purchasing and financing.",
          },
          {
            label: "🎉 Event Halls & Commercial",
            text: "Hello Tus Raíces MX, I saw your Event Halls and Commercial rentals on your website and would like free advice.",
          },
          {
            label: "📑 Legal, Notary & Title Deeds",
            text: "Hello Tus Raíces MX, I saw your Legal Advisory on your website and would like advice on cross-border notary powers.",
          },
          {
            label: "💼 IMSS Pension / Cross-Border Credit",
            text: "Hello Tus Raíces MX, I saw your IMSS & Infonavit services and would like free advice on recovering my pension weeks.",
          },
        ];

  const currentText = customText.trim() || defaultMessage;
  const currentWhatsAppLink = getWhatsAppUrl(currentText);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2.5 print:hidden">
      {/* Interactive Card / Modal */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[390px] max-w-[390px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-inner overflow-hidden border border-emerald-300">
                  <img src="/logo.png" alt="Tus Raíces MX" className="w-full h-full object-contain" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base leading-tight">
                  Tus Raíces MX • Asesores
                </h4>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  {language === "es"
                    ? "En línea • Atención directa celular"
                    : "Online • Direct cell phone support"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#f0f2f5] space-y-3 max-h-[380px] overflow-y-auto">
            {/* Incoming message bubble */}
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-slate-100 max-w-[92%] text-xs sm:text-sm text-slate-800 space-y-1">
              <p className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider">
                {language === "es" ? "Atención Binacional 🇺🇸🇲🇽" : "Bi-national Support 🇺🇸🇲🇽"}
              </p>
              <p>
                {language === "es"
                  ? "¡Hola! 👋 Bienvenido a Tus Raíces MX. Te atendemos directo en celular para responder todas tus dudas sobre inmuebles, trámites y salones en México."
                  : "Hello! 👋 Welcome to Tus Raíces MX. We help US clients with verified real estate, legal power of attorney, and Mexican pension rights."}
              </p>
              <p className="text-slate-500 text-[10px] text-right flex items-center justify-end gap-1">
                <span>{language === "es" ? "Ahora" : "Just now"}</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
              </p>
            </div>

            {/* SECCIÓN EN INGLÉS: Si el cliente está en inglés, prioriza llamada Zadarma y Call Back */}
            {language === "en" ? (
              <div className="space-y-2 pt-1 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  Preferred US Channels (No App Required):
                </p>

                {/* Zadarma Toll-Free Call */}
                <a
                  href={getCallUrl("us")}
                  className="w-full bg-[#1B4965] hover:bg-[#13374E] text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-between shadow-sm transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    Call Toll-Free: {CALL_US_DISPLAY}
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                    Free Call
                  </span>
                </a>

                {/* Free Call Back Form */}
                <a
                  href="#contacto"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-[#1B4965] py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-between transition-all"
                >
                  <span>Request a Free Call Back</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 mb-1.5">Have WhatsApp installed? Chat below:</p>
                  <a
                    href={currentWhatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat via WhatsApp Business
                  </a>
                </div>
              </div>
            ) : (
              /* SECCIÓN EN ESPAÑOL: Opciones rápidas para WhatsApp */
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-slate-600 px-1">
                  Elige el tema que te interesa:
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {quickOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomText(opt.text)}
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
            )}
          </div>

          {/* Input & Sending Actions */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={
                  language === "es"
                    ? "Escribe tu mensaje aquí..."
                    : "Type your message here..."
                }
                className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <a
                href={currentWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                aria-label="Abrir WhatsApp Business"
                title="Abrir WhatsApp Business"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </a>
            </div>

            {/* Direct Zadarma Phone Call Bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">
                  {language === "es" ? "📞 ¿Prefieres llamar gratis?" : "📞 Prefer to call toll-free?"}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  Zadarma sin costo
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={getCallUrl("us")}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#1B4965] p-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors text-center"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>🇺🇸 {CALL_US_DISPLAY}</span>
                </a>
                <a
                  href={getCallUrl("mx")}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#1B4965] p-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors text-center"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>🇲🇽 {CALL_MX_SHORT}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Speech bubble / Tooltip when closed */}
      {!isOpen && showTooltip && (
        <div className="relative bg-white text-slate-800 text-[11px] sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-xl shadow-2xl border border-emerald-100 flex items-center gap-2 max-w-[calc(100vw-5.5rem)] sm:max-w-xs animate-fade-in-up">
          <button
            onClick={() => setIsOpen(true)}
            className="text-left hover:text-emerald-700 transition-colors"
          >
            {language === "es" ? (
              <>
                <span className="font-bold text-emerald-700">🇺🇸 ¿Dudas desde EE. UU.?</span>{" "}
                Escríbenos a WhatsApp o llámanos gratis
              </>
            ) : (
              <>
                <span className="font-bold text-emerald-700">🇺🇸 Questions from the US?</span>{" "}
                Call Toll-Free or chat with us
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
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping"></span>
        )}

        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        ) : (
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
        )}
      </button>
    </div>
  );
};
