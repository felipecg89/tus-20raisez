/**
 * CONFIGURACIÓN CENTRAL DE CONTACTO - TUS RAÍCES MX
 * Separación estricta de canales:
 * 1. Llamadas Gratuitas (Zadarma en celular):
 *    - USA Toll-Free: +1 (888) 431-2431
 *    - México Lada 800: +52 (800) 461-0316 (800 461 0316)
 * 2. WhatsApp Business (App WhatsApp Business en celular):
 *    - WHATSAPP_NUMBER: Número móvil activo de WhatsApp Business (formato internacional para wa.me)
 */

// Teléfono Gratuito EE. UU. (Zadarma)
export const CALL_US_DISPLAY = "+1 (888) 431-2431";
export const CALL_US_TEL = "+18884312431";
export const CALL_US_LABEL_ES = "Llamada 100% gratuita desde cualquier parte de EE. UU.";
export const CALL_US_LABEL_EN = "100% Toll-Free call from anywhere in the U.S.";

// Teléfono Gratuito México (Zadarma)
export const CALL_MX_DISPLAY = "+52 (800) 461-0316";
export const CALL_MX_SHORT = "800 461 0316";
export const CALL_MX_TEL = "+528004610316";
export const CALL_MX_LABEL_ES = "Lada 800 Gratuita Nacional (sin costo en toda la República Mexicana)";
export const CALL_MX_LABEL_EN = "Mexico Nationwide Toll-Free 800 line";

// WhatsApp Business (Número real activo en la app WhatsApp Business)
// Puedes definir VITE_WHATSAPP_NUMBER en tu .env o editar directamente aquí
export const WHATSAPP_NUMBER =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_WHATSAPP_NUMBER) ||
  "524922432885";

export const WHATSAPP_DISPLAY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_WHATSAPP_DISPLAY) ||
  "+52 (492) 243-2885";

// Bandera para SMS en el 1-888 (solo activar cuando Zadarma confirme SMS)
export const SMS_ENABLED_US = false;

// Correo oficial
export const CONTACT_EMAIL = "asesor-patrimonial@tusraices.click";
export const CONTACT_HOURS_ES = "Lunes a Viernes de 9:00 AM a 6:00 PM (CST)";
export const CONTACT_HOURS_EN = "Monday to Friday from 9:00 AM to 6:00 PM (CST)";

/**
 * Genera el enlace directo a WhatsApp usando exclusivamente el número de WhatsApp Business
 */
export function getWhatsAppUrl(message?: string): string {
  const defaultText =
    "Hola Tus Raíces MX, visité su página web y quiero asesoría gratuita sobre propiedades y trámites en México.";
  const text = encodeURIComponent(message || defaultText);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

/**
 * Genera el enlace directo de llamada tel:
 */
export function getCallUrl(country: "us" | "mx"): string {
  return country === "us" ? `tel:${CALL_US_TEL}` : `tel:${CALL_MX_TEL}`;
}

/**
 * Genera el enlace de SMS (solo cuando SMS_ENABLED_US esté habilitado)
 */
export function getSmsUrl(message?: string): string {
  const text = encodeURIComponent(message || "");
  return `sms:${CALL_US_TEL}${text ? `?body=${text}` : ""}`;
}

/**
 * Helper para construir mensaje contextual para WhatsApp
 */
export function buildWhatsAppContextMessage(context: {
  title?: string;
  city?: string;
  price?: string | number;
  service?: string;
}): string {
  if (context.title) {
    const loc = context.city ? ` en ${context.city}` : "";
    const pr = context.price ? ` (Precio: ${context.price})` : "";
    return `Hola Tus Raíces MX, vi la propiedad "${context.title}"${loc}${pr} en su página web y quiero asesoría gratuita.`;
  }
  if (context.service) {
    return `Hola Tus Raíces MX, vi el servicio de "${context.service}" en su página web y quiero asesoría gratuita.`;
  }
  return "Hola Tus Raíces MX, vi su página web y quiero asesoría gratuita sobre propiedades y trámites en México.";
}

// Objeto de compatibilidad para código que importe CONTACT_CONFIG
export const CONTACT_CONFIG = {
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappDisplay: WHATSAPP_DISPLAY,
  phoneUSA: CALL_US_DISPLAY,
  phoneUSADisplay: `${CALL_US_DISPLAY} (${CALL_US_LABEL_ES})`,
  phoneUSARaw: CALL_US_TEL,
  phoneMX: CALL_MX_DISPLAY,
  phoneMXShort: CALL_MX_SHORT,
  phoneMXDisplay: `${CALL_MX_DISPLAY} (${CALL_MX_LABEL_ES})`,
  phoneMXRaw: CALL_MX_TEL,
  email: CONTACT_EMAIL,
  hours: CONTACT_HOURS_ES,
  smsEnabled: SMS_ENABLED_US,
};
