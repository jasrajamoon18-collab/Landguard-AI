import type { LocationBase, NERState } from "@/types/location";

// Static terrain/location data — these are geographic facts that don't change.
// Elevation, slope, and historical risk are intrinsic properties of each monitoring location.
// Environmental readings (rainfall, soil moisture, ground movement) are fetched dynamically
// from services and merged in at runtime.

export const locationBaseData: LocationBase[] = [
  // Meghalaya
  { id: "loc-001", name: "Cherrapunji Ridge", state: "Meghalaya" as NERState, lat: 25.27, lng: 91.73, elevation: 1484, slope: 38, historicalRisk: 78 },
  { id: "loc-002", name: "Mawsynram Valley", state: "Meghalaya" as NERState, lat: 25.31, lng: 91.58, elevation: 1400, slope: 42, historicalRisk: 82 },
  { id: "loc-003", name: "Shillong Peak Sector", state: "Meghalaya" as NERState, lat: 25.57, lng: 91.87, elevation: 1965, slope: 28, historicalRisk: 55 },
  { id: "loc-004", name: "Dawki Border Area", state: "Meghalaya" as NERState, lat: 25.19, lng: 92.03, elevation: 96, slope: 22, historicalRisk: 40 },
  // Sikkim
  { id: "loc-005", name: "Gangtok Hill Sector", state: "Sikkim" as NERState, lat: 27.33, lng: 88.61, elevation: 1650, slope: 35, historicalRisk: 60 },
  { id: "loc-006", name: "Nathula Pass Approach", state: "Sikkim" as NERState, lat: 27.39, lng: 88.83, elevation: 4310, slope: 45, historicalRisk: 68 },
  { id: "loc-007", name: "Pelling Ridge", state: "Sikkim" as NERState, lat: 27.32, lng: 88.24, elevation: 2150, slope: 30, historicalRisk: 45 },
  // Arunachal Pradesh
  { id: "loc-008", name: "Itanagar Foothills", state: "Arunachal Pradesh" as NERState, lat: 27.08, lng: 93.61, elevation: 440, slope: 25, historicalRisk: 50 },
  { id: "loc-009", name: "Tawang Mountain Road", state: "Arunachal Pradesh" as NERState, lat: 27.59, lng: 91.86, elevation: 3048, slope: 40, historicalRisk: 65 },
  { id: "loc-010", name: "Bomdila Pass", state: "Arunachal Pradesh" as NERState, lat: 27.26, lng: 92.42, elevation: 2415, slope: 33, historicalRisk: 48 },
  // Assam
  { id: "loc-011", name: "Guwahati Hill Tract", state: "Assam" as NERState, lat: 26.14, lng: 91.74, elevation: 55, slope: 18, historicalRisk: 35 },
  { id: "loc-012", name: "Dima Hasao Hills", state: "Assam" as NERState, lat: 25.37, lng: 93.01, elevation: 650, slope: 30, historicalRisk: 58 },
  { id: "loc-013", name: "Karbi Anglong Slope", state: "Assam" as NERState, lat: 25.67, lng: 93.44, elevation: 136, slope: 22, historicalRisk: 38 },
  // Manipur
  { id: "loc-014", name: "Imphal Valley Edge", state: "Manipur" as NERState, lat: 24.82, lng: 93.94, elevation: 786, slope: 26, historicalRisk: 52 },
  { id: "loc-015", name: "Ukhrul Ridge", state: "Manipur" as NERState, lat: 25.09, lng: 94.36, elevation: 1897, slope: 34, historicalRisk: 60 },
  // Mizoram
  { id: "loc-016", name: "Aizawl Steep Slope", state: "Mizoram" as NERState, lat: 23.73, lng: 92.72, elevation: 1132, slope: 40, historicalRisk: 72 },
  { id: "loc-017", name: "Lunglei Hill", state: "Mizoram" as NERState, lat: 22.87, lng: 92.74, elevation: 722, slope: 32, historicalRisk: 55 },
  // Nagaland
  { id: "loc-018", name: "Kohima Cliff Area", state: "Nagaland" as NERState, lat: 25.67, lng: 94.11, elevation: 1444, slope: 36, historicalRisk: 58 },
  { id: "loc-019", name: "Dimapur Foothill", state: "Nagaland" as NERState, lat: 25.91, lng: 93.73, elevation: 195, slope: 20, historicalRisk: 38 },
  // Tripura
  { id: "loc-020", name: "Agartala Hill Range", state: "Tripura" as NERState, lat: 23.84, lng: 91.28, elevation: 18, slope: 24, historicalRisk: 40 },
];

// Fallback environmental data — used when no live API source is configured.
// These are plausible seasonal estimates for the NER monsoon period, NOT real measurements.
export const fallbackEnvironmentalData: Record<string, {
  rainfall: number;
  soilMoisture: number;
  groundMovement: number;
  temperature: number;
}> = {
  "loc-001": { rainfall: 142, soilMoisture: 87, groundMovement: 9, temperature: 22 },
  "loc-002": { rainfall: 156, soilMoisture: 90, groundMovement: 11, temperature: 21 },
  "loc-003": { rainfall: 98, soilMoisture: 72, groundMovement: 5, temperature: 19 },
  "loc-004": { rainfall: 76, soilMoisture: 64, groundMovement: 3, temperature: 26 },
  "loc-005": { rainfall: 88, soilMoisture: 70, groundMovement: 6, temperature: 17 },
  "loc-006": { rainfall: 65, soilMoisture: 58, groundMovement: 7, temperature: 8 },
  "loc-007": { rainfall: 54, soilMoisture: 52, groundMovement: 2, temperature: 15 },
  "loc-008": { rainfall: 82, soilMoisture: 68, groundMovement: 4, temperature: 24 },
  "loc-009": { rainfall: 72, soilMoisture: 63, groundMovement: 6, temperature: 12 },
  "loc-010": { rainfall: 60, soilMoisture: 55, groundMovement: 3, temperature: 14 },
  "loc-011": { rainfall: 70, soilMoisture: 60, groundMovement: 2, temperature: 28 },
  "loc-012": { rainfall: 95, soilMoisture: 74, groundMovement: 5, temperature: 24 },
  "loc-013": { rainfall: 68, soilMoisture: 58, groundMovement: 2, temperature: 27 },
  "loc-014": { rainfall: 78, soilMoisture: 66, groundMovement: 4, temperature: 23 },
  "loc-015": { rainfall: 85, soilMoisture: 69, groundMovement: 5, temperature: 20 },
  "loc-016": { rainfall: 110, soilMoisture: 80, groundMovement: 8, temperature: 22 },
  "loc-017": { rainfall: 88, soilMoisture: 71, groundMovement: 4, temperature: 24 },
  "loc-018": { rainfall: 80, soilMoisture: 67, groundMovement: 5, temperature: 21 },
  "loc-019": { rainfall: 62, soilMoisture: 56, groundMovement: 2, temperature: 25 },
  "loc-020": { rainfall: 72, soilMoisture: 62, groundMovement: 2, temperature: 28 },
};

// Fallback sensor history (deterministic, not random) for charts when no live data
export function generateFallbackSensorHistory(locationId: string, hours = 24): {
  time: string;
  rainfall: number;
  soilMoisture: number;
  groundMovement: number;
  riskScore: number;
}[] {
  const base = fallbackEnvironmentalData[locationId] ?? { rainfall: 80, soilMoisture: 65, groundMovement: 4, temperature: 22 };
  const points: { time: string; rainfall: number; soilMoisture: number; groundMovement: number; riskScore: number }[] = [];
  const now = new Date();
  for (let i = hours - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    // Deterministic sinusoidal pattern based on hour index — no Math.random
    const phase = (i / hours) * Math.PI * 2;
    const rainVar = Math.sin(phase) * 20;
    const soilVar = Math.sin(phase + 1) * 10;
    const moveVar = Math.sin(phase * 0.5) * 2;
    const r = Math.max(0, base.rainfall + rainVar);
    const s = Math.max(0, Math.min(100, base.soilMoisture + soilVar));
    const m = Math.max(0, base.groundMovement + moveVar);
    points.push({
      time: t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      rainfall: Math.round(r),
      soilMoisture: Math.round(s),
      groundMovement: +m.toFixed(1),
      riskScore: Math.round(Math.min(100, r * 0.3 + s * 0.25 + 30 * 1.1 + m * 4 + 50 * 0.1)),
    });
  }
  return points;
}
