import { useEffect, useState } from "react";

export const HubSpotDebug = () => {
  const [status, setStatus] = useState<{
    scriptLoaded: boolean;
    hsqExists: boolean;
    hbsptExists: boolean;
    message: string;
  }>({
    scriptLoaded: false,
    hsqExists: false,
    hbsptExists: false,
    message: "Verificando HubSpot...",
  });

  useEffect(() => {
    // Check if HubSpot script is loaded
    const checkHubSpot = () => {
      const hsqExists = typeof (window as any).__hsq !== "undefined";
      const hbsptExists = typeof (window as any).hbspt !== "undefined";

      // Check for script in document
      const scriptElement = document.querySelector(
        'script[src*="js.hs-scripts.com"]'
      );
      const scriptLoaded = !!scriptElement;

      let message = "";
      if (scriptLoaded && hsqExists && hbsptExists) {
        message = "✅ HubSpot cargado correctamente";
      } else if (scriptLoaded && hsqExists) {
        message = "⚠️ Script cargado, esperando widget...";
      } else if (scriptLoaded) {
        message = "⏳ Script cargando...";
      } else {
        message = "❌ Script de HubSpot no encontrado";
      }

      setStatus({
        scriptLoaded,
        hsqExists,
        hbsptExists,
        message,
      });
    };

    // Check immediately
    checkHubSpot();

    // Check again after 2 seconds (tiempo para cargar)
    const timer = setTimeout(checkHubSpot, 2000);

    // Listen for script load
    const script = document.querySelector('script[src*="js.hs-scripts.com"]');
    if (script) {
      script.addEventListener("load", checkHubSpot);
      return () => {
        script.removeEventListener("load", checkHubSpot);
        clearTimeout(timer);
      };
    }

    return () => clearTimeout(timer);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#f0f0f0",
        border: "2px solid #ccc",
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "12px",
        zIndex: 9999,
        fontFamily: "monospace",
        maxWidth: "300px",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
        HubSpot Status
      </div>
      <div>{status.message}</div>
      <div style={{ marginTop: "8px", fontSize: "11px", color: "#666" }}>
        <div>Script: {status.scriptLoaded ? "✓" : "✗"}</div>
        <div>__hsq: {status.hsqExists ? "✓" : "✗"}</div>
        <div>hbspt: {status.hbsptExists ? "✓" : "✗"}</div>
      </div>
    </div>
  );
};
