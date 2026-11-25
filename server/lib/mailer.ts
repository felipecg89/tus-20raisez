import dotenv from "dotenv";
import nodemailer from "nodemailer";

export interface ContactEmailPayload {
  name: string;
  whatsapp: string;
  email: string;
  city: string;
  message?: string;
}

export interface SendEmailResult {
  sent: boolean;
  messageId?: string;
  error?: string;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeaderValue(input: string): string {
  return input.replace(/[\r\n]+/g, " ").trim();
}

export async function sendContactNotificationEmail(
  payload: ContactEmailPayload
): Promise<SendEmailResult> {
  // Recarga .env si SMTP_PASS aún no estaba en memoria (útil al editar .env en caliente)
  if (!process.env.SMTP_PASS || !process.env.SMTP_USER) {
    dotenv.config({ override: true });
  }

  const smtpHost = (process.env.SMTP_HOST || "smtp.hostinger.com").trim();
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpSecure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE.toLowerCase() === "true"
      : smtpPort === 465;
  const smtpUser = (process.env.SMTP_USER || "").trim();
  const smtpPass = process.env.SMTP_PASS || "";
  const recipientEmail = (
    process.env.CONTACT_TO_EMAIL || "asesor-patrimonial@tusraices.click"
  ).trim();

  if (!smtpUser || !smtpPass) {
    const missing = !smtpUser ? "SMTP_USER" : "SMTP_PASS";
    console.error(`[SMTP] Falta configurar ${missing} en el archivo .env`);
    return {
      sent: false,
      error: `Configuración SMTP incompleta (${missing} faltante en .env)`,
    };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const safeName = sanitizeHeaderValue(payload.name);
  const safeEmail = sanitizeHeaderValue(payload.email);
  const safeWhatsapp = sanitizeHeaderValue(payload.whatsapp);
  const safeCity = sanitizeHeaderValue(payload.city);
  const rawMessage = (payload.message || "").trim();

  const digitsOnly = safeWhatsapp.replace(/\D/g, "");
  const whatsappLink = digitsOnly
    ? `https://wa.me/${digitsOnly}?text=${encodeURIComponent(
        `Hola ${safeName}, te saludamos de Tus Raíces MX en respuesta a tu solicitud en nuestra página web.`
      )}`
    : "";

  const formattedDate = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date());

  const htmlName = escapeHtml(safeName);
  const htmlEmail = escapeHtml(safeEmail);
  const htmlWhatsapp = escapeHtml(safeWhatsapp);
  const htmlCity = escapeHtml(safeCity);
  const htmlMessage = rawMessage ? escapeHtml(rawMessage).replace(/\n/g, "<br />") : "";

  const subject = `Nuevo prospecto web: ${safeName} (${safeCity})`;

  const textBody = [
    "NUEVA SOLICITUD DE ASESORÍA - TUS RAÍCES MX",
    "============================================",
    `Nombre: ${safeName}`,
    `WhatsApp / Teléfono: ${safeWhatsapp}`,
    `Correo electrónico: ${safeEmail}`,
    `Ciudad de residencia: ${safeCity}`,
    rawMessage ? `Mensaje / Interés: ${rawMessage}` : null,
    whatsappLink ? `Contactar por WhatsApp: ${whatsappLink}` : null,
    `Fecha (Hora Centro MX): ${formattedDate}`,
  ]
    .filter(Boolean)
    .join("\n");

  const htmlBody = `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:24px;background-color:#F4F6F8;font-family:Arial,Helvetica,sans-serif;color:#101B24;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #DFE5EA;">
      <tr>
        <td style="background:#1B4965;padding:24px 28px;color:#FFFFFF;">
          <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#6EE7B7;font-weight:bold;">
            Tus Raíces MX • Formulario Web
          </p>
          <h1 style="margin:0;font-size:20px;line-height:1.3;">
            Nueva Solicitud de Asesoría Patrimonial
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 18px 0;font-size:14px;color:#465664;">
            Un visitante ha dejado sus datos de contacto en la página web:
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#F7F8FA;border-radius:12px;border:1px solid #DFE5EA;">
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #DFE5EA;font-size:12px;color:#465664;width:36%;font-weight:bold;">
                Nombre completo
              </td>
              <td style="padding:12px 16px;border-bottom:1px solid #DFE5EA;font-size:14px;color:#101B24;font-weight:bold;">
                ${htmlName}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #DFE5EA;font-size:12px;color:#465664;font-weight:bold;">
                WhatsApp / Teléfono
              </td>
              <td style="padding:12px 16px;border-bottom:1px solid #DFE5EA;font-size:14px;color:#101B24;">
                <a href="tel:${escapeHtml(safeWhatsapp)}" style="color:#1B4965;text-decoration:none;font-weight:bold;">
                  ${htmlWhatsapp}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #DFE5EA;font-size:12px;color:#465664;font-weight:bold;">
                Correo electrónico
              </td>
              <td style="padding:12px 16px;border-bottom:1px solid #DFE5EA;font-size:14px;color:#101B24;">
                <a href="mailto:${htmlEmail}" style="color:#1B4965;text-decoration:underline;">
                  ${htmlEmail}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;${htmlMessage ? "border-bottom:1px solid #DFE5EA;" : ""}font-size:12px;color:#465664;font-weight:bold;">
                Ciudad de residencia
              </td>
              <td style="padding:12px 16px;${htmlMessage ? "border-bottom:1px solid #DFE5EA;" : ""}font-size:14px;color:#101B24;">
                ${htmlCity}
              </td>
            </tr>
            ${
              htmlMessage
                ? `
            <tr>
              <td style="padding:12px 16px;font-size:12px;color:#465664;font-weight:bold;vertical-align:top;">
                Mensaje / Detalle
              </td>
              <td style="padding:12px 16px;font-size:14px;color:#101B24;line-height:1.5;">
                ${htmlMessage}
              </td>
            </tr>`
                : ""
            }
          </table>

          ${
            whatsappLink
              ? `
          <div style="margin-top:22px;text-align:center;">
            <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#25D366;color:#FFFFFF;font-weight:bold;font-size:14px;padding:12px 22px;border-radius:10px;text-decoration:none;">
              Responder por WhatsApp a ${htmlName}
            </a>
          </div>`
              : ""
          }

          <p style="margin:24px 0 0 0;padding-top:16px;border-top:1px solid #DFE5EA;font-size:11px;color:#64748B;">
            Recibido el ${escapeHtml(formattedDate)} (Hora Centro de México). Puedes responder directamente a este correo para escribirle a <strong>${htmlEmail}</strong>.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim();

  try {
    const info = await transporter.sendMail({
      from: `"Tus Raíces MX - Web" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: `"${safeName.replace(/"/g, "")}" <${safeEmail}>`,
      subject,
      text: textBody,
      html: htmlBody,
    });

    return {
      sent: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error("[SMTP] Error al enviar correo por Hostinger:", err?.message || err);
    return {
      sent: false,
      error: err?.message || "Error al conectar con el servidor SMTP de Hostinger",
    };
  }
}
