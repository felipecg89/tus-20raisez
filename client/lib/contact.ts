/**
 * Configuración oficial y centralizada de contacto para Tus Raíces MX
 * Líneas oficiales de atención a clientes y paisanos en EE.UU. y México
 */

export const CONTACT_CONFIG = {
  // Número oficial de WhatsApp Business (formato internacional para wa.me sin signos ni espacios)
  whatsappNumber: "18884312431",
  
  // Teléfono oficial para llamadas en Estados Unidos (Toll-Free)
  phoneUSA: "+1 (888) 431-2431",
  phoneUSADisplay: "+1 (888) 431-2431 (Llamadas, SMS y WhatsApp)",
  phoneUSARaw: "+18884312431",

  // Línea oficial gratuita para México
  phoneMX: "+52 (800) 461-0316",
  phoneMXDisplay: "+52 (800) 461-0316 (Lada Gratuita Nacional)",
  phoneMXRaw: "+528004610316",

  // Correo de atención
  email: "asesores@tusraices.com.mx",

  // Horario de atención
  hours: "Lunes a Viernes de 9:00 AM a 6:00 PM (CST)",
};

/**
 * Genera el enlace directo a WhatsApp Web (para navegadores en computadoras de escritorio)
 */
export function getWhatsAppWebUrl(customMessage?: string): string {
  const defaultMessage =
    "Hola, me interesa conocer más sobre las propiedades y servicios de Tus Raíces MX en México.";
  const text = encodeURIComponent(customMessage || defaultMessage);
  return `https://web.whatsapp.com/send?phone=${CONTACT_CONFIG.whatsappNumber}&text=${text}`;
}

/**
 * Detecta si el usuario está navegando desde un dispositivo móvil
 */
export function isMobileBrowser(): boolean {
  if (typeof window === "undefined" || !window.navigator) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}

/**
 * Genera el enlace directo a WhatsApp Web o App con mensaje precargado.
 * Si forceWeb es true, abre directamente web.whatsapp.com
 */
export function getWhatsAppUrl(
  customMessage?: string,
  options?: { forceWeb?: boolean }
): string {
  if (options?.forceWeb) {
    return getWhatsAppWebUrl(customMessage);
  }
  const defaultMessage =
    "Hola, me interesa conocer más sobre las propiedades y servicios de Tus Raíces MX en México.";
  const text = encodeURIComponent(customMessage || defaultMessage);
  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${text}`;
}
