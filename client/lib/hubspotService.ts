// client/lib/hubspotService.ts

// client/lib/hubspotService.ts

export const HUBSPOT_PORTAL_ID = "50787765";

export interface HubSpotContact {
  email: string;
  firstname?: string;
  lastname?: string;
  message?: string;
}

/**
 * 1. FIX ERROR 1: Agregamos "submitHubSpotForm" (sin el "To") 
 * que es el nombre exacto que busca ContactForm.tsx
 */
export async function submitHubSpotForm(formId: string, data: HubSpotContact): Promise<boolean> {
  return submitToHubSpotForm(formId, data);
}

/**
 * Mantiene la función original por si acaso algún otro archivo la usa
 */
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
            { name: "firstname", value: data.firstname || "" },
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

/**
 * 2. FIX ERROR 2: Agregamos "initializeHubSpot" 
 * que es el nombre exacto que busca client/main.tsx
 */
export function initializeHubSpot(): void {
  // Inicialización básica si tu lógica la requiere o console log preventivo
  console.log("HubSpot Service Initialized for Portal:", HUBSPOT_PORTAL_ID);
}