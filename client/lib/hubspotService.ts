// client/lib/hubspotService.ts

export const HUBSPOT_PORTAL_ID = "50787765";

export interface HubSpotContact {
  email: string;
  firstname?: string;
  lastname?: string;
  message?: string;
}

/**
 * Envía los datos del formulario de contacto directamente a HubSpot Forms API
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