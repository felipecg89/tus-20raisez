import { useEffect } from "react";
import { initializeHubSpot, trackPageView, identifyUser } from "@/lib/hubspotService";

/**
 * Hook to initialize HubSpot and track page views
 * Should be used in root App component or main layout
 */
export const useHubSpot = () => {
  useEffect(() => {
    // Initialize HubSpot on mount
    initializeHubSpot();

    // Track page view
    trackPageView(window.location.pathname);
  }, []);
};

/**
 * Hook to identify user in HubSpot
 */
export const useIdentifyHubSpotUser = (email: string | null, properties?: Record<string, any>) => {
  useEffect(() => {
    if (email) {
      identifyUser(email, properties);
    }
  }, [email, properties]);
};
