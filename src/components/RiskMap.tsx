import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Location } from "@/types";
import { riskColor } from "@/utils/risk";

interface RiskMapProps {
  locations: Location[];
  onSelectLocation?: (id: string) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
  highlightId?: string;
}

export function RiskMap({
  locations,
  onSelectLocation,
  height = "500px",
  center = [25.5, 93],
  zoom = 7,
  highlightId,
}: RiskMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    locations.forEach((loc) => {
      const color = riskColor(loc.riskLevel);
      const isHighlighted = highlightId === loc.id;
      const radius = isHighlighted ? 14 : 10;

      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius,
        fillColor: color,
        color: isHighlighted ? "#ffffff" : color,
        weight: isHighlighted ? 3 : 1.5,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map);

      const dataStatusColor = loc.dataStatus === "LIVE" ? "#22c55e" : loc.dataStatus === "SIMULATION" ? "#f97316" : loc.dataStatus === "ERROR" ? "#ef4444" : "#eab308";
      const imerg = loc.imerg;
      const imergSection = imerg
        ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #475569; line-height: 1.6;">
             <div style="font-weight: 600; color: #0891b2; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
               <span>NASA IMERG Rainfall</span>
               <span style="font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 8px; color: ${imerg.dataStatus === "LIVE" ? "#22c55e" : "#eab308"}; border: 1px solid ${imerg.dataStatus === "LIVE" ? "#22c55e" : "#eab308"};">${imerg.dataStatus}</span>
             </div>
             <div>30 min: <b>${imerg.precipitation30min.toFixed(1)} mm</b></div>
             <div>3 hour: <b>${imerg.precipitation3h.toFixed(1)} mm</b></div>
             <div>24 hour: <b>${imerg.precipitation24h.toFixed(1)} mm</b></div>
             <div>3 day: <b>${imerg.precipitation3d.toFixed(1)} mm</b></div>
             <div>7 day: <b>${imerg.precipitation7d.toFixed(1)} mm</b></div>
             <div style="margin-top: 4px; font-size: 10px; color: #94a3b8;">${imerg.product} · ${imerg.run}</div>
             <div style="font-size: 10px; color: #94a3b8;">Observed: ${new Date(imerg.observationTime).toISOString().slice(0, 16).replace("T", " ")} UTC</div>
           </div>`
        : "";

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 240px; color: #1e293b;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${loc.name}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${loc.state}</div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${color}; display: flex; align-items: center; justify-items: center; color: white; font-weight: 700; font-size: 12px; line-height: 28px; text-align: center;">${loc.riskScore}</div>
            <div style="font-size: 12px; font-weight: 600; color: ${color};">${loc.riskLevel}</div>
            <div style="margin-left: auto; font-size: 10px; font-weight: 600; color: ${dataStatusColor}; border: 1px solid ${dataStatusColor}; border-radius: 10px; padding: 1px 6px;">${loc.dataStatus}</div>
          </div>
          <div style="font-size: 11px; color: #475569; line-height: 1.6;">
            <div>Rainfall (24h): <b>${loc.rainfall} mm</b></div>
            <div>Soil Moisture: <b>${loc.soilMoisture}%</b></div>
            <div>Slope: <b>${loc.slope}&deg;</b></div>
            <div>Ground Movement: <b>+${loc.groundMovement} mm</b></div>
            <div>Elevation: <b>${loc.elevation} m</b></div>
            <div>Historical Risk: <b>${loc.historicalRisk}%</b></div>
          </div>
          ${imergSection}
          ${onSelectLocation ? `<button onclick="document.dispatchEvent(new CustomEvent('mapselect', {detail: '${loc.id}'}))" style="margin-top: 10px; width: 100%; padding: 6px 12px; background: #0891b2; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">Analyze this location</button>` : ""}
        </div>
      `;
      marker.bindPopup(popupContent, { maxWidth: 300 });
      markersRef.current[loc.id] = marker;
    });
  }, [locations, highlightId, onSelectLocation]);

  useEffect(() => {
    if (!onSelectLocation) return;
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail as string;
      onSelectLocation(id);
    };
    document.addEventListener("mapselect", handler);
    return () => document.removeEventListener("mapselect", handler);
  }, [onSelectLocation]);

  return <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-xl overflow-hidden" />;
}
