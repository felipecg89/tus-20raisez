import { RequestHandler } from "express";

/**
 * Encabezados HTTP de alta seguridad (Hardening)
 */
export const securityHeaders: RequestHandler = (_req, res, next) => {
  // Ocultar firma del servidor
  res.removeHeader("X-Powered-By");

  // Prevención de MIME sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevención de Clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // HSTS (Forzar HTTPS durante 1 año, incluyendo subdominios)
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Control de Referrer
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Restricción de APIs del navegador
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.hsforms.net https://js.hs-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://api.hsforms.com https://*.hubspot.com; frame-ancestors 'self';"
  );

  next();
};

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}): RequestHandler {
  const ipStore = new Map<string, RateLimitRecord>();

  // Limpieza periódica cada ventana para evitar crecimiento de memoria
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipStore.entries()) {
      if (now > record.resetTime) {
        ipStore.delete(ip);
      }
    }
  }, options.windowMs);

  // Asegurar que el temporizador no bloquee el proceso
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req, res, next) => {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown-ip";

    const now = Date.now();
    const record = ipStore.get(ip);

    if (!record || now > record.resetTime) {
      ipStore.set(ip, {
        count: 1,
        resetTime: now + options.windowMs,
      });
      return next();
    }

    record.count++;

    if (record.count > options.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter.toString());
      return res.status(429).json({
        error: options.message || "Demasiadas peticiones. Por favor inténtalo más tarde.",
      });
    }

    next();
  };
}

// Limitadores preconfigurados
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 10, // Máximo 10 intentos de login/signup
  message: "Demasiados intentos de autenticación. Intente en 15 minutos.",
});

export const contactRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutos
  maxRequests: 8, // Máximo 8 mensajes
  message: "Has superado el límite de mensajes permitidos. Intenta más tarde.",
});

export const apiGeneralLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minuto
  maxRequests: 150, // 150 peticiones por minuto
  message: "Límite de velocidad de peticiones excedido.",
});
