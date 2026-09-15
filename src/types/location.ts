import type { RiskLevel } from "./risk";
import type { ImergData } from "./imerg";

export type NERState =
  | "Arunachal Pradesh"
  | "Assam"
  | "Meghalaya"
  | "Manipur"
  | "Mizoram"
  | "Nagaland"
  | "Tripura"
  | "Sikkim";

export interface LocationBase {
  id: string;
  name: string;
  state: NERState;
  lat: number;
  lng: number;
  elevation: number; // meters
  slope: number; // degrees
  historicalRisk: number; // %
}

export interface Location extends LocationBase {
  rainfall: number; // mm (24h precipitation — primary rainfall input, from IMERG or fallback)
  soilMoisture: number; // % (from sensor service or fallback)
  groundMovement: number; // mm (from ground movement service or fallback)
  riskScore: number; // 0-100 (calculated)
  riskLevel: RiskLevel;
  status: "MONITORING" | "ALERT" | "CRITICAL";
  dataStatus: DataStatus;
  lastUpdated: string;
  imerg?: ImergData; // NASA IMERG precipitation data (multi-window)
}

export type DataStatus = "LIVE" | "FALLBACK" | "SIMULATION" | "ERROR";

export interface DataSourceInfo {
  status: DataStatus;
  label: string;
  description: string;
}

export const NER_STATES: NERState[] = [
  "Arunachal Pradesh",
  "Assam",
  "Meghalaya",
  "Manipur",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Sikkim",
];
