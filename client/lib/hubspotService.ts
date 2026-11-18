// client/lib/hubspotService.ts

export const HUBSPOT_PORTAL_ID = "50787765";

export interface HubSpotContact {
  email: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  whatsapp?: string;
  city?: string;
  message?: string;
}

export interface ContactFormData {
  name?: string;
  whatsapp?: string;
  email: string;
  city?: string;
  message?: string;
}

export async function submitHubSpotForm(
  data: ContactFormData
): Promise<{ success: boolean }>;
export async function submitHubSpotForm(
  formId: string,
  data: HubSpotContact
): Promise<boolean>;
export async function submitHubSpotForm(
  formIdOrData: string | ContactFormData,
  data?: HubSpotContact
): Promise<{ success: boolean } | boolean> {
  if (typeof formIdOrData === "string") {
    return submitToHubSpotForm(formIdOrData, data || { email: "" });
  }

  const formData = formIdOrData;
  try {
    const contact: HubSpotContact = {
      email: formData.email,
      firstname: formData.name,
      message: `WhatsApp: ${formData.whatsapp || ""} - Ciudad: ${formData.city || ""} - Mensaje: ${formData.message || ""}`,
    };
    const ok = await submitToHubSpotForm("default", contact);
    return { success: ok };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false };
  }
}

export async function submitToHubSpotForm(formId: string, data: HubSpotContact): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${formId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: [
            { name: "email", value: data.email },
            { name: "firstname", value: data.firstname || data.name || "" },
            { name: "lastname", value: data.lastname || "" },
            { name: "message", value: data.message || "" }
          ],
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Error submitting to HubSpot:", error);
    return false;
  }
}

export function initializeHubSpot(): void {
  console.log("HubSpot Service Initialized for Portal:", HUBSPOT_PORTAL_ID);
}

export function trackPageView(path?: string): void {
  const currentPath = path || (typeof window !== "undefined" ? window.location.pathname : "");
  console.log("HubSpot trackPageView:", currentPath);
  if (typeof window !== "undefined" && (window as any)._hsq) {
    (window as any)._hsq.push(["setPath", currentPath]);
    (window as any)._hsq.push(["trackPageView"]);
  }
}

export function identifyUser(email: string, properties?: Record<string, any>): void {
  console.log("HubSpot identifyUser:", email, properties);
  if (typeof window !== "undefined" && (window as any)._hsq) {
    (window as any)._hsq.push(["identify", { email, ...properties }]);
  }
}
