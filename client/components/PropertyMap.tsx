import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyMapProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  title: string;
  city: string;
}

export const PropertyMap = ({
  address,
  latitude,
  longitude,
  title,
  city,
}: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically load Leaflet library
    if (!mapContainer.current) return;

    // Load Leaflet CSS and JS
    if (!window.L) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.async = true;
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapContainer.current || mapRef.current) return;

      const L = window.L;

      // Default coordinates for Mexico City if no coordinates provided
      const lat = latitude || 19.4326;
      const lng = longitude || -99.1332;

      // Initialize map
      mapRef.current = L.map(mapContainer.current).setView([lat, lng], 15);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add marker with popup
      const marker = L.marker([lat, lng], {
        title: title,
      }).addTo(mapRef.current);

      const popupContent = `
        <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
        <div style="font-size: 0.9em; color: #666;">
          ${address || city}
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();
    }

    return () => {
      // Cleanup
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, address, title, city]);

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        {language === "es" ? "Ubicación" : "Location"}
      </h3>

      {address && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-foreground/70 mb-1">
            {language === "es" ? "Dirección" : "Address"}
          </p>
          <p className="font-semibold text-foreground">{address}</p>
        </div>
      )}

      <div
        ref={mapContainer}
        className="w-full h-96 rounded-lg border border-border overflow-hidden"
        style={{ minHeight: "400px" }}
      />

      <p className="text-xs text-foreground/50 mt-2">
        {language === "es"
          ? "Haz click en el marcador para ver más detalles"
          : "Click on the marker for more details"}
      </p>
    </div>
  );
};
