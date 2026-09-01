import type { Location, RiskLevel } from "@/types";
import { classifyRisk } from "@/utils/risk";

interface RawLocation {
  id: string;
  name: string;
  state: Location["state"];
  lat: number;
  lng: number;
  rainfall: number;
  soilMoisture: number;
  slope: number;
  elevation: number;
  groundMovement: number;
  historicalRisk: number;
}

const rawLocations: RawLocation[] = [
  // Meghalaya
  { id: "loc-001", name: "Cherrapunji Ridge", state: "Meghalaya", lat: 25.27, lng: 91.73, rainfall: 142, soilMoisture: 87, slope: 38, elevation: 1484, groundMovement: 9, historicalRisk: 78 },
  { id: "loc-002", name: "Mawsynram Valley", state: "Meghalaya", lat: 25.31, lng: 91.58, rainfall: 156, soilMoisture: 90, slope: 42, elevation: 1400, groundMovement: 11, historicalRisk: 82 },
  { id: "loc-003", name: "Shillong Peak Sector", state: "Meghalaya", lat: 25.57, lng: 91.87, rainfall: 98, soilMoisture: 72, slope: 28, elevation: 1965, groundMovement: 5, historicalRisk: 55 },
  { id: "loc-004", name: "Dawki Border Area", state: "Meghalaya", lat: 25.19, lng: 92.03, rainfall: 76, soilMoisture: 64, slope: 22, elevation: 96, groundMovement: 3, historicalRisk: 40 },
  // Sikkim
  { id: "loc-005", name: "Gangtok Hill Sector", state: "Sikkim", lat: 27.33, lng: 88.61, rainfall: 88, soilMoisture: 70, slope: 35, elevation: 1650, groundMovement: 6, historicalRisk: 60 },
  { id: "loc-006", name: "Nathula Pass Approach", state: "Sikkim", lat: 27.39, lng: 88.83, rainfall: 65, soilMoisture: 58, slope: 45, elevation: 4310, groundMovement: 7, historicalRisk: 68 },
  { id: "loc-007", name: "Pelling Ridge", state: "Sikkim", lat: 27.32, lng: 88.24, rainfall: 54, soilMoisture: 52, slope: 30, elevation: 2150, groundMovement: 2, historicalRisk: 45 },
  // Arunachal Pradesh
  { id: "loc-008", name: "Itanagar Foothills", state: "Arunachal Pradesh", lat: 27.08, lng: 93.61, rainfall: 82, soilMoisture: 68, slope: 25, elevation: 440, groundMovement: 4, historicalRisk: 50 },
  { id: "loc-009", name: "Tawang Mountain Road", state: "Arunachal Pradesh", lat: 27.59, lng: 91.86, rainfall: 72, soilMoisture: 63, slope: 40, elevation: 3048, groundMovement: 6, historicalRisk: 65 },
  { id: "loc-010", name: "Bomdila Pass", state: "Arunachal Pradesh", lat: 27.26, lng: 92.42, rainfall: 60, soilMoisture: 55, slope: 33, elevation: 2415, groundMovement: 3, historicalRisk: 48 },
  // Assam
  { id: "loc-011", name: "Guwahati Hill Tract", state: "Assam", lat: 26.14, lng: 91.74, rainfall: 70, soilMoisture: 60, slope: 18, elevation: 55, groundMovement: 2, historicalRisk: 35 },
  { id: "loc-012", name: "Dima Hasao Hills", state: "Assam", lat: 25.37, lng: 93.01, rainfall: 95, soilMoisture: 74, slope: 30, elevation: 650, groundMovement: 5, historicalRisk: 58 },
  { id: "loc-013", name: "Karbi Anglong Slope", state: "Assam", lat: 25.67, lng: 93.44, rainfall: 68, soilMoisture: 58, slope: 22, elevation: 136, groundMovement: 2, historicalRisk: 38 },
  // Manipur
  { id: "loc-014", name: "Imphal Valley Edge", state: "Manipur", lat: 24.82, lng: 93.94, rainfall: 78, soilMoisture: 66, slope: 26, elevation: 786, groundMovement: 4, historicalRisk: 52 },
  { id: "loc-015", name: "Ukhrul Ridge", state: "Manipur", lat: 25.09, lng: 94.36, rainfall: 85, soilMoisture: 69, slope: 34, elevation: 1897, groundMovement: 5, historicalRisk: 60 },
  // Mizoram
  { id: "loc-016", name: "Aizawl Steep Slope", state: "Mizoram", lat: 23.73, lng: 92.72, rainfall: 110, soilMoisture: 80, slope: 40, elevation: 1132, groundMovement: 8, historicalRisk: 72 },
  { id: "loc-017", name: "Lunglei Hill", state: "Mizoram", lat: 22.87, lng: 92.74, rainfall: 88, soilMoisture: 71, slope: 32, elevation: 722, groundMovement: 4, historicalRisk: 55 },
  // Nagaland
  { id: "loc-018", name: "Kohima Cliff Area", state: "Nagaland", lat: 25.67, lng: 94.11, rainfall: 80, soilMoisture: 67, slope: 36, elevation: 1444, groundMovement: 5, historicalRisk: 58 },
  { id: "loc-019", name: "Dimapur Foothill", state: "Nagaland", lat: 25.91, lng: 93.73, rainfall: 62, soilMoisture: 56, slope: 20, elevation: 195, groundMovement: 2, historicalRisk: 38 },
  // Tripura
  { id: "loc-020", name: "Agartala Hill Range", state: "Tripura", lat: 23.84, lng: 91.28, rainfall: 72, soilMoisture: 62, slope: 24, elevation: 18, groundMovement: 2, historicalRisk: 40 },
];

export const locations: Location[] = rawLocations.map((r) => {
  const score = Math.round(
    Math.min(100, r.rainfall * 0.3 + r.soilMoisture * 0.25 + r.slope * 1.1 + r.groundMovement * 4 + r.historicalRisk * 0.1),
  );
  const level = classifyRisk(score);
  const status: Location["status"] =
    level === "CRITICAL" ? "CRITICAL" : level === "HIGH" ? "ALERT" : "MONITORING";
  return { ...r, riskScore: score, riskLevel: level, status };
});

export function getLocationsByLevel(level: RiskLevel): Location[] {
  return locations.filter((l) => l.riskLevel === level);
}

export const NER_STATES: Location["state"][] = [
  "Arunachal Pradesh",
  "Assam",
  "Meghalaya",
  "Manipur",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Sikkim",
];
